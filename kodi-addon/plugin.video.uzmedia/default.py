
import xbmcplugin, xbmcgui, sys, json, urllib.request

HANDLE=int(sys.argv[1])
data = json.loads(urllib.request.urlopen("https://kodi-lf7y.onrender.com/api/movies").read())

for m in data:
 li=xbmcgui.ListItem(label=m['title'])
 li.setProperty("IsPlayable","true")
 xbmcplugin.addDirectoryItem(HANDLE,m['url'],li)

xbmcplugin.endOfDirectory(HANDLE)
