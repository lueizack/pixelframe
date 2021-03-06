<? /*
  pf_thumbnail.php - contains functions related to generating thumbnails
*
* Copyright (C)      2007  Nikhil Marathe <nsm.nikhil@gmail.com>
*               
* This file is part of the PixelFrame project.
*
* This program is free software; you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation; either version 2 of the License, or
* (at your option) any later version.
* 
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* 
* You should have received a copy of the GNU General Public License
* along with this program; if not, write to the Free Software
* Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
*/

/**
* Creates a thumbnail from an image.

 @param string $imageName Filename of the original image(png or jpeg)
 @param string $thumbnail File to write the thumbnail to (jpg/png ONLY).
 @param integer $width Width of the thumbnail
 @param integer $height Hieght of the thumbnail

 @return bool true on success, false on failure
*/
function makeThumbnail($imageName, $thumbnail, $width=70, $height=70)
{
    //try to load jpeg, otherwise try png
    $image = null;
    if(!($image = @imagecreatefromjpeg( $imageName)))
    {
        if(!($image = @imagecreatefrompng( $imageName)))
        {
            return false;
        }
    }

    $thumb = imagecreatetruecolor($width, $height);

    if(!imagecopyresampled($thumb, $image, 0, 0, 0, 0, $width, $height, imagesx($image), imagesy($image))) return false;

    $ext = substr($thumbnail, -3);
    if($ext == "jpg" || $ext == "jpeg")
    {
        if(!imagejpeg($thumb, $thumbnail)) return false;
    }
    else if($ext == "png")
    {
        if(!imagepng($thumb, $thumbnail)) return false;
    }

    return true;
} 
