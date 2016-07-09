
<?php
//generate a exel or a dynamic view of location where your website is being watched

//ip adress log name
$outputWebBug = 'iplog.csv';

//Get the ip address and info about the client
$ip= $_SERVER['REMOTE_ADDR'];
@ $details = json_decode(file_get_contents("http://ipinfo.io/{$ip}/json"));
@ $hostname=gethostbyaddr($_SERVER['REMOTE_ADDR']);
//Write the ip address into a file

//initializing variable
$QUERY_STRING= "";
$details->loc="";
$details->org="";
$details->city="";
$details->region="";
$details->country="";

@ $fileHandle = fopen($outputWebBug, "a");

//write to a csv file
if ($fileHandle)
{
    $string='"'.$QUERY_STRING.'","'//everything after "?" in the URL
        .$_SERVER['REMOTE_ADDR'].'","'//ip address
        .$hostname.'","'//hostname
        .$_SERVER['HTTP_USER_AGENT'].'","'//browser and operating system
        .$_SERVER['HTTP_REFERER'].'","'//where they got the link for this page
        .$details->loc.'","'//latitude, longitude
        .$details->org.'","'//internet service provider
        .$details->city.'","'//city
        .$details->region.'","'//region
        .$details->country.'","'//country
        .date("D dS M, Y h:i a").'"'//date
        ."\n"
        ;
    $write=fputs($fileHandle, $string);
    @ fclose($fileHandle);
}
//To display on the screen
$string= '<code>'
    .'<p>'.$QUERY_STRING.'</p><p>IP address: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    .$_SERVER['REMOTE_ADDR'].'</p><p>Hostname:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    .$hostname.'</p><p>Browser and OS:&nbsp;'
    .$_SERVER['HTTP_USER_AGENT'].'</p><p>'
    .$_SERVER['HTTP_REFERER'].'</p><p>Coordinates:&nbsp;&nbsp;&nbsp;&nbsp;'
    .$details->loc.'</p><p>ISP provider:&nbsp;&nbsp;&nbsp;'
    .$details->org.'</p><p>City:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    .$details->city.'</p><p>State:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    .$details->region.'</p><p>Country:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
    .$details->country.'</p><p>Date:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'.date("D dS M, Y H:i a").'</p></code>';

echo '<!DOCTYPE html><html><head><title>God View</title></head><body>';
echo $string;
echo '</body></html>';
?>
    