import json, os, urllib.request, urllib.parse
UA={"User-Agent":"TEDxThynaYouth-site/1.0 (affes.zied@tedxthyna.com)"}
def get(u):
    return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=60).read()
os.makedirs("out",exist_ok=True)
manifest=[]
# --- Wikimedia Commons: Sfax ---
cats=["Hôtel de ville de Sfax","Medina of Sfax","Bab Diwan (Sfax)","Ramparts of Sfax","Sfax","Grand Mosque of Sfax","Night views of Sfax","Municipal Theatre of Sfax","Dar Jallouli Museum","Sfax Cathedral"]
for cat in cats:
    q=("https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=categorymembers&gcmtype=file&gcmlimit=200"
       "&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=2400&gcmtitle="+urllib.parse.quote("Category:"+cat))
    try: data=json.loads(get(q))
    except Exception as e: print("ERR",cat,e); continue
    pages=list((data.get("query") or {}).get("pages",{}).values())
    imgs=[]
    for p in pages:
        ii=(p.get("imageinfo") or [{}])[0]
        if not ii.get("url","").lower().endswith((".jpg",".jpeg")): continue
        w,h=ii.get("width",0),ii.get("height",0)
        if w<2400 or w<h: continue
        md=ii.get("extmetadata",{})
        imgs.append((w*h,p["title"],ii.get("thumburl") or ii["url"],md.get("LicenseShortName",{}).get("value",""),md.get("Artist",{}).get("value","")))
    imgs.sort(reverse=True)
    for i,(px,title,url,lic,artist) in enumerate(imgs[:6]):
        fn="out/commons-"+cat.split(" ")[0].lower()+f"-{i}.jpg"
        try:
            open(fn,"wb").write(get(url)); manifest.append({"file":fn,"title":title,"license":lic,"artist":artist,"src":url})
        except Exception as e: print("ERR",title,e)
# --- Unsplash (free license) ---
for q in ["conference stage spotlight","microphone stage red light","audience theater lights","speaker on stage","backstage team event","notebook pen planning dark","tedx stage","red theatre seats"]:
    try:
        data=json.loads(get("https://unsplash.com/napi/search/photos?per_page=6&orientation=landscape&query="+urllib.parse.quote(q)))
    except Exception as e: print("ERR",q,e); continue
    for i,r in enumerate(data.get("results",[])[:6]):
        if r.get("premium") or r.get("plus"): continue
        fn="out/unsplash-"+q.split(" ")[0]+"-"+q.split(" ")[1]+f"-{i}.jpg"
        try:
            open(fn,"wb").write(get(r["urls"]["raw"]+"&w=2400&q=85&fm=jpg"))
            manifest.append({"file":fn,"title":r.get("alt_description"),"license":"Unsplash License","artist":r["user"]["name"],"src":r["links"]["html"]})
        except Exception as e: print("ERR",fn,e)
json.dump(manifest,open("out/manifest.json","w"),indent=1)
print(len(manifest),"files")
