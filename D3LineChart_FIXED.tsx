import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// Define DataRow type inline
interface DataRow {
  id: number;
  value: number;
  label?: string;
}

interface D3LineChartProps {
  data: DataRow[];
  onDataChange?: (data: DataRow[]) => void;
}

export function D3LineChart({ data, onDataChange }: D3LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const isDraggingRef = useRef(false);
  const dataRef = useRef(data);
  const pathRef = useRef<d3.Selection<SVGPathElement, DataRow[], SVGGElement, unknown> | null>(null);
  const areaPathRef = useRef<d3.Selection<SVGPathElement, DataRow[], SVGGElement, unknown> | null>(null);

  // Keep dataRef in sync with props
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement;
        if (container) {
          const width = container.clientWidth;
          const height = Math.min(400, width * 0.5);
          setDimensions({ width, height });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    const margin = { top: 40, right: 40, bottom: 50, left: 60 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleLinear()
      .domain([1, 10])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([-10, 10])
      .range([height, 0]);

    g.append("defs")
      .append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", yScale(-10))
      .attr("x2", 0)
      .attr("y2", yScale(10))
      .selectAll("stop")
      .data([
        { offset: "0%", color: "oklch(0.65 0.15 220)" },
        { offset: "100%", color: "oklch(0.75 0.12 220)" }
      ])
      .enter()
      .append("stop")
      .attr("offset", (d: { offset: string; color: string }) => d.offset)
      .attr("stop-color", (d: { offset: string; color: string }) => d.color);

    const yGridLines = [-10, -5, 0, 5, 10];
    g.selectAll(".grid-line")
      .data(yGridLines)
      .enter()
      .append("line")
      .attr("class", "grid-line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", (d: number) => yScale(d))
      .attr("y2", (d: number) => yScale(d))
      .attr("stroke", (d: number) => d === 0 ? "oklch(0.7 0.01 240)" : "oklch(0.9 0.005 240)")
      .attr("stroke-width", (d: number) => d === 0 ? 1.5 : 1)
      .attr("stroke-dasharray", (d: number) => d === 0 ? "0" : "4,4");

    const xAxis = d3
      .axisBottom(xScale)
      .tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
      .tickFormat((d: d3.NumberValue) => d.toString());

    const yAxis = d3
      .axisLeft(yScale)
      .tickValues([-10, -5, 0, 5, 10]);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .attr("class", "axis")
      .selectAll("text")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("letter-spacing", "0.02em")
      .style("fill", "oklch(0.5 0.01 240)");

    g.append("g")
      .call(yAxis)
      .attr("class", "axis")
      .selectAll("text")
      .style("font-size", "12px")
      .style("font-weight", "500")
      .style("fill", "oklch(0.5 0.01 240)");

    g.selectAll(".axis path, .axis line")
      .style("stroke", "oklch(0.8 0.01 240)");

    const line = d3
      .line<DataRow>()
      .x((d: DataRow) => xScale(d.id))
      .y((d: DataRow) => yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const areaGenerator = d3
      .area<DataRow>()
      .x((d: DataRow) => xScale(d.id))
      .y0(height)
      .y1((d: DataRow) => yScale(d.value))
      .curve(d3.curveCatmullRom.alpha(0.5));

    const areaGradient = g
      .append("defs")
      .append("linearGradient")
      .attr("id", "area-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", yScale(10))
      .attr("x2", 0)
      .attr("y2", yScale(-10));

    areaGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "oklch(0.65 0.15 220)")
      .attr("stop-opacity", 0.15);

    areaGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "oklch(0.65 0.15 220)")
      .attr("stop-opacity", 0.02);

    const areaPath = g
      .append("path")
      .datum(data)
      .attr("fill", "url(#area-gradient)")
      .attr("d", areaGenerator)
      .style("transition", "d 0.3s ease");
    
    areaPathRef.current = areaPath;

    const path = g
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "url(#line-gradient)")
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round")
      .attr("d", line);

    pathRef.current = path;

    const totalLength = path.node()?.getTotalLength() || 0;
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(800)
      .ease(d3.easeQuadInOut)
      .attr("stroke-dashoffset", 0);

    const tooltip = d3.select(tooltipRef.current);

    const pointsGroup = g.append("g").attr("class", "points");

    const drag = d3.drag<SVGCircleElement, DataRow>()
      .on("start", function(this: SVGCircleElement) {
        isDraggingRef.current = true;
        d3.select(this)
          .raise()
          .attr("r", 7)
          .attr("stroke-width", 3);
        tooltip.style("opacity", "0");
      })
      .on("drag", function(this: SVGCircleElement, event: any, d: DataRow) {
        const gNode = g.node();
        if (!gNode) return;
        
        const [mouseX, mouseY] = d3.pointer(event, gNode);
        const clampedY = Math.max(0, Math.min(height, mouseY));
        let newValue = yScale.invert(clampedY);
        newValue = Math.max(-10, Math.min(10, newValue));
        newValue = Math.round(newValue * 10) / 10;
        
        // Update the circle position
        d3.select(this)
          .attr("cy", yScale(newValue));

        // Update the data reference object (mutate)
        const dataIndex = dataRef.current.findIndex((item: DataRow) => item.id === d.id);
        if (dataIndex !== -1) {
          dataRef.current[dataIndex].value = newValue;
        }

        // Update the line path in real-time (without transition)
        if (pathRef.current) {
          pathRef.current.attr("d", line(dataRef.current) as string);
        }
        
        // Update the area in real-time
        if (areaPathRef.current) {
          areaPathRef.current.attr("d", areaGenerator(dataRef.current) as string);
        }

        if (onDataChange) {
          onDataChange(dataRef.current);
        }
      })
      .on("end", function(this: SVGCircleElement) {
        d3.select(this)
          .transition()
          .duration(150)
          .attr("r", 5)
          .attr("stroke-width", 2);
        
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 200);
      });

    pointsGroup
      .selectAll("circle")
      .data(data, (d: DataRow) => d.id.toString())
      .enter()
      .append("circle")
      .attr("cx", (d: DataRow) => xScale(d.id))
      .attr("cy", (d: DataRow) => yScale(d.value))
      .attr("r", 5)
      .attr("fill", "oklch(0.99 0 0)")
      .attr("stroke", "oklch(0.65 0.15 220)")
      .attr("stroke-width", 2)
      .style("cursor", "grab")
      .style("transition", "r 0.15s ease, stroke-width 0.15s ease")
      .call(drag)
      .on("mouseenter", function(this: SVGCircleElement, event: any, d: DataRow) {
        const isDragging = d3.select(this).attr("r") === "7";
        if (!isDragging) {
          d3.select(this)
            .transition()
            .duration(150)
            .attr("r", 6);
        }

        tooltip
          .style("opacity", "1")
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`)
          .html(`
            <div style="font-weight: 600; margin-bottom: 4px;">Point ${d.id}</div>
            ${d.label ? `<div style="color: oklch(0.5 0.01 240); margin-bottom: 4px;">${d.label}</div>` : ''}
            <div style="color: oklch(0.65 0.15 220); font-weight: 600;">Value: ${d.value.toFixed(1)}</div>
            <div style="color: oklch(0.5 0.01 240); font-size: 12px; margin-top: 4px;">Drag to adjust</div>
          `);
      })
      .on("mousemove", function(this: SVGCircleElement, event: any) {
        const isDragging = d3.select(this).attr("r") === "7";
        if (!isDragging) {
          tooltip
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`);
        }
      })
      .on("mouseleave", function(this: SVGCircleElement) {
        const isDragging = d3.select(this).attr("r") === "7";
        if (!isDragging) {
          d3.select(this)
            .transition()
            .duration(150)
            .attr("r", 5);

          tooltip.style("opacity", "0");
        }
      });

  }, [data, dimensions, onDataChange]);

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
      />
      <div
        ref={tooltipRef}
        style={{
          position: 'fixed',
          opacity: 0,
          pointerEvents: 'none',
          background: 'oklch(0.99 0 0)',
          border: '1px solid oklch(0.88 0.01 240)',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          fontSize: '14px',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          transition: 'opacity 0.15s ease',
          zIndex: 1000,
        }}
      />
    </div>
  );
}
