<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**    Copyright (C) 2009  Matt Bury
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

$string['mplayer:addinstance'] = 'Ajoute une instance';
$string['mplayer:view'] = 'Voir le média';

// Default module labels.
$string['backtocourse'] = 'Revenir au cours';
$string['mediaviewed'] = 'Visionnage';
$string['completionmediaviewed'] = 'marqué complet quand l\'étudiant a visionné tout le média';
$string['mplayer'] = 'Media Player';
$string['pluginname'] = 'Media Player';
$string['pluginadministration'] = 'Administration du Media Player';
$string['modulename'] = 'Media Player';
$string['modulenameplural'] = 'Media Players';
$string['updatetechnology'] = 'Changer de technologie';

// Titles for mod/mplayer/mod_form.php sections.
$string['player'] = 'Player';
$string['mplayername'] = 'Nom';
$string['mplayerintro'] = 'Description';
$string['summary'] = 'Description';
$string['video'] = 'Vidéo(s) interne(s)';
$string['fullurl'] = 'Vidéo(s) externes (via URLs)';
$string['xmlplaylist'] = 'Playlist XML';
$string['httpxmlplaylist'] = 'Playlist XML externe (via http)';
$string['none'] = 'Aucun';
$string['playlistlocalpath'] = 'Schéma d\'URL du chemin local des vidéos';
$string['playlistfile'] = 'Fichier de playlist';
$string['playlistthumb'] = 'Vignettes de play list';
$string['clearplaylist'] = 'Supprimer le fichier de playlist';
$string['clearconfigxml'] = 'Supprimer le fichier de configuration XML';
$string['invalidmplayerid'] = 'Cet ID de player est invalide';
$string['nomplayers'] = 'Aucun player vidéo dans ce cours';
$string['technology'] = 'Technologie';
$string['allowtechnologychoice'] = 'Les auteurs peuvent choisir';
$string['allowtechnologychoicedesc'] = 'Si activé, les auteurs peuvent choisir la technologie du player instance par instance.';
$string['configsubtitles'] = 'Option des sous-titres';
$string['langselection'] = 'Langue des sous-titres';
$string['langcourse'] = 'Langue du cours';
$string['languser'] = 'Langue du profil utilisateur';
$string['langfreechoice'] = 'Langue au choix';
$string['langteacherchoice'] = 'Langue au choix de l\'enseignant';
$string['langforced'] = 'Langue forcée';
$string['showdebugcode'] = 'Afficher le code de deboggage';
$string['loadingplayer'] = 'Chargement en cours...';
$string['videomplayer'] = 'Video';

// Labels for mod/mplayer/mod_form.php.
// Source.
$string['mplayerresources'] = 'Resources Media';
$string['mplayerfiles'] = 'Fichiers de Media';
$string['type'] = 'Type';
$string['streamer'] = 'Serveur de flux';
$string['external'] = 'Url Externe';

// Playlists.
$string['playlists'] = 'Playlist';
$string['playlist'] = 'Position';
$string['playlistsize'] = 'Taille (pixels)';
$string['playliststyle'] = 'Apparence';
$string['item'] = 'Elément de départ';
$string['thumbs'] = 'Vignettes';
$string['bottom'] = 'En dessous';
$string['left'] = 'A gauche';
$string['right'] = 'A droite';
$string['over'] = 'En surimpression';
$string['above'] = 'Au dessus';

// Configxml.
$string['config'] = 'Config XML';
$string['configxml'] = 'Fichier';

// Track file.
$string['track'] = 'Sous-titres';
$string['trackfile'] = 'Fichier';
$string['trackfilegroup'] = 'Fichier de sous-titres';
$string['cleartrackfile'] = 'Vider la zone de fichiers';

// Appearance.
$string['appearance'] = 'Apparence';
$string['notes'] = 'Notes';
$string['width'] = 'Largeur';
$string['height'] = 'Hauteur';
$string['skin'] = 'Skin';
$string['configskin'] = 'Skin (JW Player)';
$string['image'] = 'Poster';
$string['icons'] = 'Afficher les icones';
$string['controlbar'] = 'Barre de commandes';
$string['smoothing'] = 'Attenuation';
$string['backcolor'] = 'Couleur de fond';
$string['frontcolor'] = 'Couleur de premier plan';
$string['lightcolor'] = 'Couleur claire';
$string['screencolor'] = 'Couleur d\'écran';

// Behaviour.
$string['behaviour'] = 'Comportement';
$string['autostart'] = 'Exécution auto';
$string['fullscreen'] = 'Plein écran';
$string['nativefullscreen'] = 'Contrôles natifs de plein écran (flowplayer)';
$string['volume'] = 'Volume';
$string['mute'] = 'Mute';
$string['mplayerstart'] = 'Début (position en secondes)';
$string['duration'] = 'Durée (secondes)';
$string['mplayerrepeat'] = 'Répétition';
$string['shuffle'] = 'Lecture aléatoire';
$string['bufferlength'] = 'Longueur de buffer (secondes)';
$string['quality'] = 'Qualité';
$string['displayclick'] = 'Click audio';
$string['resizing'] = 'Redimensionnement';
$string['stretching'] = 'Ajustement à l\'échelle';
$string['configstretching'] = 'Ajustement à l\'échelle (JW Player)';
$string['plugins'] = 'Plugins';
$string['splashmode'] = 'Mode splash (flowplayer)';
$string['splashenabled'] = 'Actif';
$string['nosplash'] = 'Inactif';

// Metadata.
$string['metadata'] = 'Métadonnées';
$string['author'] = 'Source';
$string['mplayerdate'] = 'Ajouté';
$string['title'] = 'Titre';
$string['description'] = 'Description du média';
$string['tags'] = 'Tags';

// Audiodescription.
$string['audiodescription'] = 'Description audio';
$string['audiodescriptionfile'] = 'Fichier MP3';
$string['audiodescriptionstate'] = 'Démarrage auto';
$string['audiodescriptionvolume'] = 'Volume';

// Captions.
$string['captions'] = 'Sous-titres';
$string['captionsback'] = 'Fond transparent';
$string['captionsfile'] = 'Fichier de sous-titres';
$string['captionsfontsize'] = 'Taille de police';
$string['captionsstate'] = 'Afficher les sous-titres';

// HD.
$string['hd'] = 'Video HD';
$string['hdbitrate'] = 'Débit';
$string['hdfile'] = 'Fichier Video HD';
$string['hdfullscreen'] = 'Passer en haute résolution plein écran';
$string['hdstate'] = 'HD par défaut';

// Infobox.
$string['infobox'] = 'Fenêtre d\'information';
$string['infoboxcolor'] = 'Couleur de fond';
$string['infoboxposition'] = 'Position';
$string['infoboxsize'] = 'Taille';

// Livestream.
$string['livestream'] = 'Lecture continue de flux';
$string['livestreamfile'] = 'Flux RTMP';
$string['livestreamimage'] = 'Image';
$string['livestreaminterval'] = 'Intervalle';
$string['livestreammessage'] = 'Message';
$string['livestreamstreamer'] = 'Serveur de flux';
$string['livestreamtags'] = 'Tags';

// Logo Box.
$string['logobox'] = 'Incrustation Logo';
$string['logoboxalign'] = 'Alignement';
$string['logoboxfile'] = 'Image';
$string['logoboxlink'] = 'Lien';
$string['logoboxmargin'] = 'Marge';
$string['logoboxposition'] = 'Position';

// Metaviewer.
$string['metaviewer'] = 'Affichage des métadonnées';
$string['metaviewerposition'] = 'Position';
$string['metaviewersize'] = 'Taille';

// Searchbar.
$string['searchbar'] = 'Barre de recherche';
$string['searchbarcolor'] = 'couleur';
$string['searchbarlabel'] = 'Label';
$string['searchbarposition'] = 'Position';
$string['searchbarscript'] = 'Script';

// Snapshot.
$string['snapshot'] = 'Capture';
$string['snapshotbitmap'] = 'Bitmap';
$string['snapshotscript'] = 'Script';

// Logo.
$string['logo'] = 'Logo (seulement avec licence)';
$string['logofile'] = 'Image';
$string['logolink'] = 'Url';
$string['logohide'] = 'Masquage automatique';
$string['logoposition'] = 'Position';

// Advanced.
$string['advanced'] = 'Configuration Avancée';
$string['fpversion'] = 'Version de player flash';
$string['tracecall'] = 'Trace d\'appels (déboggage)';

// Cues.
$string['cuelaunch'] = 'Lancer le {$a}';
$string['cueininvite'] = 'Avant de continuer la projection de cette vidéo, vous êtes invité à participer à un {$a->type}.<br/><br/>{$a->link}';
$string['cueininviteoptional'] = 'Avant de continuer la projection de cette vidéo, vous êtes invité à participer à un {$a->type}.<br/><br/>{$a->link}<br/><a href="javascript:cuepoint_resume_from_id(\'{$a->playerid}\')">Reprendre la lecture</a>';
$string['resumefromcue'] = 'Vous pouvez maintenant reprendre la lecture.';


// Storage.
$string['httpmediaserver'] = 'Serveur de média HTTP';
$string['httpmediapath'] = 'Chemin HTTP aux media';
$string['httpmediacontentdir'] = 'Répertoire de stockage des medias HTTP';
$string['confighttpmediaserver'] = 'http://medias.mon-domaine.com';
$string['confighttpmediapath'] = '/mon/chemin';
$string['confighttpmediacontentdir'] = 'Répertoire de stockage des medias HTTP comme montage NFS d\'un répertoire déporté';
$string['wowzaserver'] = 'Hôte RTMP/HTTP/HLS';
$string['wowzaapplication'] = 'Application de flux';
$string['wowzacontentdir'] = 'Répertoire partagé des contenus vidéo';
$string['configwowzaserver'] = 'rtmp://your.server.name';
$string['configwowzaapplication'] = '/vod';
$string['configwowzacontentdir'] = 'Ce répertoire est un montage système d\'un répertoire distant du serveur de flux.';

// SWF embed alternative content error message for mod/swf/view.php.
$string['embederror1'] = '<h3>Oups ! Il y a un problème.</h3>
<h4>Un Player Flash de version ';
$string['embederror2'] = ' ou plus récente est demandé.</h4>';
$string['nohtml5'] = '<h2>La vidéeo HTML5 n\'est pas supportée par votre navigateur.</h2>';

global $CFG;

$string['mplayer_appearance'] = 'Apparence';
$string['mplayer_appearance_help'] = '
<div class="indent">
  <p><strong>Notes</strong>: A web page displayed under the video window. Supports rich text, links, images, plugins, Flash, etc.</p>
  <p><strong>Width</strong>: 0 - 9999 (% values are also possible)</p>
  <p><strong>Height</strong>: 0 - 9999</p>
  <p><strong>Skin</strong>: change the design of the video player interface</p>
  <p><strong>Poster Image</strong>: JPG, GIF, PNG or SWF to display before video playback starts (Behaviour &gt; Auto Start must be set to &quot;false&quot;)</p>
  <p><strong>Show Icons</strong>: show pause/play/streaming icons in centre of video window</p>
  <p><strong>Control Bar</strong>: </p>
  <ul>
    <li>none = no playback controls</li>
    <li>bottom = playback controls under the video window</li>
    <li>over  = playback controls on top of the video window</li>
  </ul>
  <p><strong>Control Bar Colors</strong>:</p>
  <ul>
    <li>Back Color - control bar background color</li>
    <li>Light Color - control bar icons and text color</li>
    <li>Front Color - control bar video position scrubber and volume control color</li>
    <li>Screen Color - video window background color</li>
  </ul>
  <p><strong>Smoothing</strong>: smooths out pixels in video image (leave as &quot;true&quot; unless users have very slow computers)</p>
  <p><strong>Quality</strong>: overall display quality of Flash Player plugin  (leave as &quot;best&quot; unless users have very slow computers)</p>
  <p><strong></strong>Colors are  hexidecimal values - e.g. black = 000000, white = FFFFFF, red = FF0000, green = 00FF00 and blue = 0000FF</p>
<p>Activity Module Developed by Matt Bury - <a href="http://matbury.com/" target="_blank">http://matbury.com/</a></p>
<p>JW FLV Player Developed By Jeroen Wijering - <a href="http://www.longtailvideo.com/" target="_blank">http://www.longtailvideo.com/</a></p>
</div>
';

$string['mplayer_audiodescription'] = 'Description audio';
$string['mplayer_audiodescription_help'] = '
<div class="indent">
</div>
';

$string['mplayer_behaviour'] = 'Comportement';
$string['mplayer_behaviour_help'] = '
<div class="indent">
  <p><strong>Auto Start</strong>: démarre la vidéo dès la publication sur la page. Incompatible avec le mode Splash.</p>
  <p><strong>Full Screen</strong>: autorise l\'utilisateur à passer en mode plein écran</p>
  <p><strong>Mode Splash</strong>: Permet de charger le player sur demande, et de n\'en jouer qu\'un à la fois sur une même page. Incompatible avec le mode AutoStart.</p>
  <p><strong>Volume</strong>: volume audio (les utilisateurs peuvent toujours ajuster le volume par le curseur de contrôle)</p>
  <p><strong>Mute</strong>: mute audio (les utilisateurs peuvent enlever le mute sur la barre de contrôle audio)</p>
</div>
';

$string['mplayer_captions'] = 'Sous-titres';
$string['mplayer_captions_help'] = '
<div class="indent">
  <p><strong>Transparent Background</strong>: If set to true, the plugin will render a semi-transparent background instead of a black outline.</p>
  <p><strong>Captions File</strong>: supports SMIL TimedText.xml and SubRip.srt*</p>
  <p><strong>Font Size</strong>: size of captions text</p>
  <p><strong>Show Captions</strong>: show captions by default (users can switch them on or off)</p>
  <p>* Subtitles displayed using the captions plugin are much clearer and easier to read than embedded captions and you have more control over their appearance. Here\'s a useful tool for extracting embedded subtitles from video files: <a href="http://zuggy.wz.cz/">http://zuggy.wz.cz/</a></p>
  <p>More details about this plugin:   <a href="http://developer.longtailvideo.com/trac/wiki/PluginsCaptions">http://developer.longtailvideo.com/trac/wiki/PluginsCaptions</a></p>
  <p>Activity Module Developed by Matt Bury - <a href="http://matbury.com/" target="_blank">http://matbury.com/</a></p>
<p>JW FLV Player Developed By Jeroen Wijering - <a href="http://www.longtailvideo.com/" target="_blank">http://www.longtailvideo.com/</a></p>
</div>
';

$string['mplayer_configxml'] = 'Configuration XML';
$string['mplayer_configxml_help'] = '
<div class="indent">
  <p><strong>File</strong>: Configuration XML file that can be used to set all the parameters on this page.</p>
  <p>Particularly useful if you want to have one external file that determines the parameters of serveral Media Player instances allowing you to edit them all by editing a single file.</p>
  <p>Activity Module Developed by Matt Bury - <a href="http://matbury.com/" target="_blank">http://matbury.com/</a></p>
<p>JW FLV Player Developed By Jeroen Wijering - <a href="http://www.longtailvideo.com/" target="_blank">http://www.longtailvideo.com/</a></p>
</div>
';

$string['mplayer_hd'] = 'Haute Définition';
$string['mplayer_hd_help'] = '
<div class="indent">
  <p><strong>Bitrate</strong>: This only needs to be set for RTMP streaming to enable automated bandwidth switching</p>
  <p><strong>HD Video File</strong>: alternative HD video file</p>
  <p><strong>Switch to HD on Full Screen</strong>: when user clicks on full screen button, stream switches to HD version</p>
  <p><strong>Default HD</strong>: play HD video by default</p>
  <p>With progressive download, video will restart when switching between HD and normal streams.</p>
  <p>For more information see:   <a href="http://developer.longtailvideo.com/trac/wiki/PluginsHd">http://developer.longtailvideo.com/trac/wiki/PluginsHd</a></p>
<p>Activity Module Developed by Matt Bury - <a href="http://matbury.com/" target="_blank">http://matbury.com/</a></p>
<p>JW FLV Player Developed By Jeroen Wijering - <a href="http://www.longtailvideo.com/" target="_blank">http://www.longtailvideo.com/</a></p>
</div>
';

$string['mplayer_infobox'] = 'Boîte d\'information';
$string['mplayer_infobox_help'] = '
<div class="indent">
  <p><strong>Background Color</strong>: hexidecimal number e.g. black=000000, white=FFFFFF, red=FF0000, etc.</p>
  <p><strong>Position</strong>:</p>
  <ul>
    <li>none = no Infobox</li>
    <li>bottom = under the video window</li>
    <li>over = in the video window, is hidden when video plays</li>
    <li>top = above the video window</li>
  </ul>
  <p><strong>Size</strong>: 0 - 999</p>
  <p>For more information see:   <a href="http://developer.longtailvideo.com/trac/wiki/PluginsInfobox">http://developer.longtailvideo.com/trac/wiki/PluginsInfobox</a></p>
<p>Activity Module Developed by Matt Bury - <a href="http://matbury.com/" target="_blank">http://matbury.com/</a></p>
<p>JW FLV Player Developed By Jeroen Wijering - <a href="http://www.longtailvideo.com/" target="_blank">http://www.longtailvideo.com/</a></p>
</div>
';

$string['mplayer_livestream'] = 'Distribution de flux continu';
$string['mplayer_livestream_help'] = '
<div class="indent">
  <p><strong>RTMP Stream</strong>: nom du flux RTMP à charger</p>
  <p><strong>Image</strong>: image à montrer quand le flux se termine</p>
  <p><strong>Interval</strong>: interval in seconds to check for RTMP stream</p>
  <p><strong>Message</strong>: shown to user while plugin checks for RTMP stream</p>
  <p><strong>Streamer</strong>: RTMP server to pull stream from</p>
  <p><strong>Tags</strong>: (advanced only)</p>
  <p>For more information see:   <a href="http://developer.longtailvideo.com/trac/wiki/PluginsLivestream">http://developer.longtailvideo.com/trac/wiki/PluginsLivestream</a></p>
<p>Activity Module Developed by Matt Bury - <a href="http://matbury.com/" target="_blank">http://matbury.com/</a></p>
<p>JW FLV Player Developed By Jeroen Wijering - <a href="http://www.longtailvideo.com/" target="_blank">http://www.longtailvideo.com/</a></p>
</div>
';

$string['mplayer_logo'] = 'Logo';
$string['mplayer_logo_help'] = '
<div class="indent">
  <p><strong>Image:</strong> Logo JPG, GIF, PNG ou SWF</p>
  <p><strong>Link:</strong> ouvre une nouvelle fenêtre</p>
  <p><strong>Auto Hide</strong>: logo fades out when there is no mouse activity</p>
  <p><strong>Position</strong>:</p>
  <ul>
    <li>en bas à gauche</li>
    <li>en bas à droite</li>
    <li>en haut à gauche</li>
    <li>en haut à droite</li>
  </ul>
  <p><strong>Please note:</strong> Logo &amp; logo link only function in licensed versions of the JW Player. See Logo Box for unlicenced players.</p>
  <p>Activity Module Developed by Matt Bury - <a href="http://matbury.com/" target="_blank">http://matbury.com/</a></p>
<p>JW FLV Player Developed By Jeroen Wijering - <a href="http://www.longtailvideo.com/" target="_blank">http://www.longtailvideo.com/</a></p>
</div>
';

$string['mplayer_logobox'] = 'Incrustation de logo';
$string['mplayer_logobox_help'] = '
<div class="indent">
  <p><strong>Align</strong>: alignment of logo</p>
  <p><strong>Image</strong>: JPG, GIF, PNG or SWF logo to display</p>
  <p><strong>Link</strong>: URL to open (new window) when user clicks on logo</p>
  <p><strong>Margin</strong>: area/border around logo</p>
  <p><strong>Position</strong>: when set to &quot;over&quot;, the box background is hidden</p>
  <p>For more information see:   <a href="http://developer.longtailvideo.com/trac/wiki/PluginsLogobox">http://developer.longtailvideo.com/trac/wiki/PluginsLogobox</a></p>
<p>Activity Module Developed by Matt Bury - <a href="http://matbury.com/" target="_blank">http://matbury.com/</a></p>
<p>JW FLV Player Developed By Jeroen Wijering - <a href="http://www.longtailvideo.com/" target="_blank">http://www.longtailvideo.com/</a></p>
</div>
';

$string['mplayer_metadata'] = 'Metadonnées';
$string['mplayer_metadata_help'] = '
<div class="indent">
  <p><strong>Source</strong>: Author or creator of the video (automatically inserts current user\'s name)</p>
<p><strong>Added</strong>: Date video was added to Moodle (automatically inserts today\'s date)</p>
  <p><strong>Title</strong>: Title of video</p>
  <p><strong>Media Description</strong>: Short description of video (255 characters)</p>
  <p><strong>Tags</strong>:   keywords associated with the media file (separated by commas)</p>
  <p>To display metadata to users, see Infobox.</p>
  <p>Activity Module Developed by Matt Bury - <a href="http://matbury.com/" target="_blank">http://matbury.com/</a></p>
<p>JW FLV Player Developed By Jeroen Wijering - <a href="http://www.longtailvideo.com/" target="_blank">http://www.longtailvideo.com/</a></p>
</div>
';

$string['mplayer_metaviewer'] = 'Visualisateur de métadonnées';
$string['mplayer_metaviewer_help'] = '
<div class="indent">
  <p><strong>Position</strong>: </p>
  <ul>
    <li>none = no metaviewer</li>
    <li>over = on top of video window</li>
    <li>left</li>
    <li>right</li>
    <li>top</li>
    <li>bottom</li>
  </ul>
  <p><strong>Size</strong>: 0 - 999</p>
  <p>NB: Useful for debugging or examining video file properties but not much else.</p>
<p>Activity Module Developed by Matt Bury - <a href="http://matbury.com/" target="_blank">http://matbury.com/</a></p>
<p>JW FLV Player Developed By Jeroen Wijering - <a href="http://www.longtailvideo.com/" target="_blank">http://www.longtailvideo.com/</a></p>
</div>
';

$string['mplayer_playlist'] = 'Playlist';
$string['mplayer_playlist_help'] = '
<div class="indent">
  <p><strong>Position</strong>: </p>
  <ul>
    <li>none = no playlist</li>
    <li>bottom = under the video window</li>
    <li>right = to the right of the video window</li>
    <li>over = playlist covers the screen, disappears when user plays video</li>
  </ul>
  <p><strong>Size</strong>: 0 - 9999 pixels</p>
  <p><strong>Start Item</strong>: 0 - 99</p>
  <p><strong>Repeat</strong>: </p>
  <ul>
    <li>none = don\'t repeat</li>
    <li>list = play entire playlist once</li>
    <li>always = repeat entire playlist</li>
    <li>single = repeat selected item on playlist</li>
  </ul>
  <p><strong>Shuffle</strong>: play playlist items in random order</p>
  <p>Activity Module Developed by Matt Bury - <a href="http://matbury.com/" target="_blank">http://matbury.com/</a></p>
<p>JW FLV Player Developed By Jeroen Wijering - <a href="http://www.longtailvideo.com/" target="_blank">http://www.longtailvideo.com/</a></p>
</div>
';

$string['mplayer_resources'] = 'Source';
$string['mplayer_resources_help'] = '
<div class="indent">
  <p><strong>Container de ressources :</strong> vous pouvez organiser l\'ensemble des ressources et fichiers utiles à la projection de vos médias dans cette zone de fichiers. </p>
  <ul>
    <li><b>Zone des médias :</b> Téléchargez les vidéso dans cette zone. Une seul vidéo peut résider à la racine de ce chemin. Une playlist implicite ordonnée peut être jouée si :
    <li>Les fichiers dans "medias" ont un préfixe numérique (0_..., 1_..., 2_..., etc.) ou</li>
    <li>sont déposés dans des répertoires numérotés par clip, en partant de 0</li>
    </li>
    <li><b>Zone des vignettes :</b> Si vous utilisez la présentation en "vignettes" de la playlist, alors déposez des ilages vignettes dans ce répertoire, numérottées comme les vidéos ou dans des répertoires numérotés.</li>
    <li>Video file types can be an FLV, F4V, MOV, MP4 ou tout type de fichier supporté par le player HTML5 ou le player JW suivant votre choix. </li>
    <li>Si la vidéo est hébergée sur un domaine tiers, un réglage spécifique de "crossdomain" doit avoir été fait sur ce domaine. Par exemple si votre Moodle est sur &quot;http://mymoodle.com/&quot;, et la vidéo sur &quot;http://someotherserver.com/videos/sample_video.flv&quot;, vous devrez être sûr de disposer d\'un fichier crossdomain.xml sur &quot;http://someotherserver.com/crossdomain.xml&quot;. Certains sites d\'hégergement de vidéo tels que YouTube.com ont déjà une police d\'accès global sur leur site, vous permettant de consommer les vidéos sur ces sites sans aucune configuration. Pour plus de détails, voir: <a href="http://kb2.adobe.com/cps/142/tn_14213.html">http://kb2.adobe.com/cps/142/tn_14213.html</a></li>
    <li>You can also link to an XML playlist here. For more information about playlists, see:   <a href="http://code.google.com/p/moodle-flv-player/wiki/UsingXMLPlaylists">http://code.google.com/p/moodle-flv-player/wiki/UsingXMLPlaylists</a></li>
  </ul>
  <p><strong>Type:</strong> The type of media and type of delivery to be used for the Video URL provided. The settings are:</p>
  <ul>
    <li><strong>default</strong> - a URL link to a video file available over the Internet. Must start with http://...</li>
    <li><strong>Sound</strong> - a link to an MP3 or AAC file in the Moodle course files directory</li>
    <li><strong>Image</strong> - a link to an image file in the Moodle course files directory</li>
    <li><strong>Video</strong> - a link to a video file in the Moodle course files directory</li>
    <li><strong>YouTube</strong> - a URL link to a video file hosted on YouTube</li>
    <li><strong>Camera</strong> -  (advanced) accesses the user\'s web camera if present and turned on</li>
    <li><strong>HTTP Streaming</strong> - (advanced) consume media streams from an HTTP media server</li>
    <li><strong>Lighttpd Streaming</strong> - (advanced) consume media streams from a Lighttpd media server</li>
    <li><strong>RTMP Streaming</strong> - (advanced) consume media streams from an RTMP media server such Red5, Flash Media Server or Wowza. Please note: Do not include file extensions when using RTMP, i.e. &quot;myvideofile&quot; not &quot;myvideofile.flv&quot;.</li>
  </ul>
  <p><strong>Streamer:</strong> (advanced) the gateway of the streaming server to be used (requires configuration by a developer). More than one streaming server configuration is possible.</p>
  <p>&nbsp;</p>
  <p>Activity Module Developed by Matt Bury - <a href="http://matbury.com/" target="_blank">http://matbury.com/</a></p>
<p>JW FLV Player Developed By Jeroen Wijering - <a href="http://www.longtailvideo.com/" target="_blank">http://www.longtailvideo.com/</a></p>
</div>
';

$string['cue_list'] = 'Cuelists';
$string['cue_list_help'] = '
<div class="indent">
  <p>Une "cuelist" est une liste d\'évenements positionnée sur la ligne de temps de la vidéo et pouvant
  déclencher des actions pendant la lecture de la vidéo.</p>
  <p><strong>video|timestamp1|url|timestamp2;</strong></p>
  <ul>
    <li>video = numero de la video dans la playlist</li>
    <li>timestamp1 = instant de déclenchemnt (en secondes.dixièmmes)</li>
    <li>url = URL à déclencher</li>
    <li>timestamp2 = optionnel :
        <ul>
            <li>0 : la vidéo repart au début lorsque la fenêtre est refermée</li>
            <li>timestamp : la fenêtre est refermée et la vidéo est jouée après le délai défini</li>
            <li>empty : pas d\'action spécifique</li>
        </ul>
    </li>
  </ul>
</div>';

$string['mplayer_technology'] = 'Technologie';
$string['mplayer_technology_help'] = '
<p>Le MPlayer supporte les deux technologies Flowplayer HTML5 et JW player. Les administrateurs peuvent choisir de forcer la technologie active dans tous les players,
ou laisser le choix aux enseignants sur chaque instance.</p>
<p>Lorsque vous changez de technologie, enregistrez une première fois les réglages puis réouvrez les paramètres pour obtenir les paramètres spécifiques à la technologie choisie.</p>
';

$string['mplayer_track'] = 'sous-titres';
$string['mplayer_track_help'] = '
Admet un fichier VTT qui est un simple fichier texte formaté d\'une certaine manière pour fournir les sous-titres
correspondant aux instants de la vidéo. Attention ce fichier doit être encodé en UTF-8.

----
WEBVTT FILE

1
00:00:01.000 --> 00:00:04.000
Le premier sous-titre à afficher entre 1 seconde et 4 secondes
Avec une seconde ligne et
une troisième ligne

2
00:00:05.000 --> 00:00:06.000
<b>Gras</b>, <i>italiques</i> and <u>soulignages</u> sont supportés

...
----

voir : http://www.delphiki.com/webvtt/ pour une spécification complète du format.

';

$string['modulename_help'] = 'La ressource MPlayer offre une intégration vidéo complète, flexible, et riche en fonctionnalités
pédagogiques ajoutées.

Vous pouvez publier vos vidéo comme des fichiers locaux (plutot déconseillé), mais aussi sous forme de ressources distantes à travers
des URLs ou des serveurs de flux déportés.

Vous pouvez gérer des listes de chapitrage, des sous-titres en plusieurs langues ainsi que des points d\'arrêts pédagogiques qui peuvent
intercaler des actvitiés pédagogiques au milieu du visionnage.
';