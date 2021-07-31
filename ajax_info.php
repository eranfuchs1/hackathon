<?php

if (array_key_exists('html', $_POST))
{
	$myfile = fopen("newfile.txt", "w") or die("Unable to open file!");
	fwrite($myfile, $_POST['html']);
	fclose($myfile);
}
if (array_key_exists('js_namespace', $_POST))
{
	$myfile = fopen("js.txt", "w") or die("Unable to open file!");
	fwrite($myfile, $_POST['js_namespace']);
	fclose($myfile);
}

else if (array_key_exists('js', $_GET))
{
	$myfile2 = fopen("js.txt", "r") or die("Unable to open file!");
	echo fread($myfile2,filesize("js.txt"));
	fclose($myfile2);
}
else
{
	$myfile2 = fopen("newfile.txt", "r") or die("Unable to open file!");
	echo fread($myfile2,filesize("newfile.txt"));
	fclose($myfile2);
}
?>
