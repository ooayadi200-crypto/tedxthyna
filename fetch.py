import json, os, sys, urllib.request, urllib.parse, traceback
UA={"User-Agent":"TEDxThynaYouthWebsite/1.0 (https://tedxthyna.com; affes.zied@tedxthyna.com) python-urllib"}
os.makedirs("out",exist_ok=True)
log=open("out/log.txt","w")
def L(*a): print(*a); print(*a,file=log); log.flush()
def get(u):
    return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=90).read()
manifest=[]
def save(fn,url,meta):
    try:
        data=get(url); open(fn,"wb").write(data); meta.update(file=fn,bytes=len(data)); manifest.append(meta); L("OK",fn,len(data))
    except Exception as e: L("ERR dl",fn,url,e)

# Wikimedia Commons search (namespace 6 = files)
for i_q,q in enumerate(["Sfax medina","Sfax hotel de ville","Sfax Bab Diwan","Sfax night","Sfax city","Sfax theatre municipal","Sfax ramparts","Sfax panorama"]):
    api=("https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=40"
         "&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=2560&gsrsearch="+urllib.parse.quote(q+" filetype:bitmap"))
    try: data=json.loads(get(api))
    except Exception as e: L("ERR api",q,e); continue
    pages=list((data.get("query") or {}).get("pages",{}).values()); L("Q",q,len(pages))
    imgs=[]
    for p in pages:
        ii=(p.get("imageinfo") or [{}])[0]; u=ii.get("url","")
        if not u.lower().endswith((".jpg",".jpeg")): continue
        w,h=ii.get("width",0),ii.get("height",0)
        if w<2500 or w<h*1.1: continue
        md=ii.get("extmetadata",{})
        imgs.append((w*h,p["title"],ii.get("thumburl") or u,md.get("LicenseShortName",{}).get("value",""),md.get("Artist",{}).get("value","")[:120],w,h))
    imgs.sort(reverse=True)
    for i,(px,title,url,lic,art,w,h) in enumerate(imgs[:5]):
        save(f"out/sfax-{i_q}-{i}.jpg",url,{"title":title,"license":lic,"artist":art,"orig":f"{w}x{h}"})

# Openverse (CC-licensed, commercial use allowed)
for q in ["conference stage spotlight","microphone stage","theater audience","speaker stage lights","event team backstage","red theater curtain","notebook planning desk"]:
    api="https://api.openverse.org/v1/images/?page_size=8&license_type=commercial&aspect_ratio=wide&size=large&q="+urllib.parse.quote(q)
    try: data=json.loads(get(api))
    except Exception as e: L("ERR ov",q,e); continue
    res=data.get("results",[]); L("OV",q,len(res))
    for i,r in enumerate(res[:6]):
        save("out/ov-"+q.replace(" ","_")+f"-{i}.jpg",r["url"],{"title":r.get("title"),"license":(r.get("license") or "")+" "+(r.get("license_version") or ""),"artist":r.get("creator"),"src":r.get("foreign_landing_url"),"orig":f"{r.get('width')}x{r.get('height')}"})
json.dump(manifest,open("out/manifest.json","w"),indent=1)
L("TOTAL",len(manifest))
