Storage infrastructure is dedicated to define the several video storage capabilities
in the mplayer.

In the most common case, the video and other assets are stored within the Moodle file store, 
and thus are served by a moodle php pluginfile script. this can lead to cross-impact between
video and moodle web pages serving.

alternate storages can be used to remote the storage to another location from where
it can be served by a third party server engine.

Architecturally, a storage should define :

  * A path where to move the video material
  * A constructor to a way to access to it (usually the URL to be used)

- Simple remote HTTP :

The video is stored on another volume that can be directly served by HTTP standard access using
a remote dedicated Web server.

- Simple remote HTTP with H264 facility

This is almost a similar case to above, the only difference will be in that the web server will be equiped 
with the H264 plugin.