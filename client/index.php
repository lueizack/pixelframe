<?php
/*
*  index.php - Generates album for viewing by loading theme and stuff
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

//accepts GET parameter album=<album name>

include_once("../scripts/pf_constants.php");
include_once(PF_SCRIPTS_DIR."pf_configparser.php");
include_once(PF_SCRIPTS_DIR."pf_theme_manager.php");

//begin new session
session_start();

/**************************
 1. check if album exists
**************************/
$albumName = $_GET['album'];

$albumLocation = "";
$albumTheme = "";

$cp = new ConfigReader(PF_CONFIG_FILE);
$albums = $cp->getChildren("settings/albums");
if($albums) {
    $albumExists = FALSE;
    foreach($albums as $album) {
        if($album['attributes']['name'] == $albumName) {
            $albumLocation = $album['attributes']['location'];
            $albumTheme = $album['attributes']['theme'];
            $albumExists = TRUE;
        }
    }
    if(!albumExists) {
        print("There is no album called $albumName.");
        return;
    }
}
else {
    print("There are no albums");
    return;
}

/********************************
 2. Check if theme exists.
    Otherwise switch to default
********************************/
$availableThemes = getThemeList();
if(!array_key_exists($availableThemes, $albumTheme))
    $albumTheme = PF_DEFAULT_THEME;
$albumThemeLocation = $availableThemes[$albumTheme];