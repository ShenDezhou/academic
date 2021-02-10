ls=document.querySelectorAll('#Profile-zvideos > div > div > div > h2 > a')
d = Array.from(ls).map(i=>{
  return {'a':i.href,'t':i.innerText}
})
JSON.stringify(d)


ls=document.querySelectorAll('#user-repositories-list > ul > li > div.col-10.col-lg-9.d-inline-block > div.d-inline-block.mb-1 > h3 > a')
urls=Array.from(ls).map(i=>i.href)

ls=document.querySelectorAll('#user-repositories-list > ul > li > div.col-10.col-lg-9.d-inline-block > div > p')
text=Array.from(ls).map(i=>i.innerText)
