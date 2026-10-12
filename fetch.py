import json, os, urllib.request, urllib.parse
UA={"User-Agent":"TEDxThynaYouthWebsite/1.0 (https://tedxthyna.com; affes.zied@tedxthyna.com) python-urllib"}
os.makedirs("out",exist_ok=True); log=open("out/log.txt","w")
def L(*a): print(*a); print(*a,file=log); log.flush()
def get(u): return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=120).read()
manifest=[]; seen=set()
def save(fn,url,meta):
    try:
        d=get(url); open(fn,"wb").write(d); meta.update(file=fn,bytes=len(d)); manifest.append(meta); L("OK",fn,len(d))
    except Exception as e: L("ERR dl",fn,e)
n=0
for q in ["Sfax","Sfax medina","Sfax Tunisia city","Sfax hôtel de ville","Sfax Bab Diwan","Sfax night","Sfax mosque","Sfax corniche","Sfax port","Sfax kasbah"]:
    api=("https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=50"
         "&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=2560&gsrsearch="+urllib.parse.quote(q))
    try: data=json.loads(get(api))
    except Exception as e: L("ERR api",q,e); continue
    pages=list((data.get("query") or {}).get("pages",{}).values())
    for p in pages:
        t=p["title"]
        if t in seen: continue
        seen.add(t)
        ii=(p.get("imageinfo") or [{}])[0]; u=ii.get("url",""); w,h=ii.get("width",0),ii.get("height",0)
        L("C",t,w,h)
        if not u.lower().endswith((".jpg",".jpeg")) or w<1800 or w<h*1.2: continue
        md=ii.get("extmetadata",{})
        n+=1
        save(f"out/sfax-{n:02d}.jpg",ii.get("thumburl") or u,{"title":t,"license":md.get("LicenseShortName",{}).get("value",""),"artist":md.get("Artist",{}).get("value","")[:150],"orig":f"{w}x{h}","page":"https://commons.wikimedia.org/wiki/"+urllib.parse.quote(t.replace(' ','_'))})
        if n>=40: break
    if n>=40: break
for q in ["Sfax"]:
    try: data=json.loads(get("https://api.openverse.org/v1/images/?page_size=20&license_type=commercial&q=Sfax"))
    except Exception as e: L("ERR ov",e); continue
    for i,r in enumerate(data.get("results",[])):
        if (r.get("width") or 0)<1800: continue
        save(f"out/ov-sfax-{i}.jpg",r["url"],{"title":r.get("title"),"license":(r.get("license") or "")+" "+(r.get("license_version") or ""),"artist":r.get("creator"),"page":r.get("foreign_landing_url"),"orig":f"{r.get('width')}x{r.get('height')}"})
json.dump(manifest,open("out/manifest.json","w"),indent=1); L("TOTAL",len(manifest))
