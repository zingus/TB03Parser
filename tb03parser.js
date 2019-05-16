function TB03Parser(dirname,callback) {
  var res={}
  fs.readdir(dn,(err,fnlist)=>{
    res.expectedLength=fnlist.length
    res.length=0

    fnlist.forEach(fn=>{
      var fnfull=dn+"/"+fn
      var re=/^TB03_(PTN)(\d+)_(\d+).PRM|TB03_(TRACK)(\d+).PRM/i
      var m=re.exec(fn)
      if (!m) return
      //console.log(1,m)
      fs.readFile(fnfull,(err,data)=>{
        data=TB03Parser.parseFileContents(fnfull,data.toString())
        if(m[1]) { // PTN
          m[2]=parseInt(m[2])-1
          m[3]=parseInt(m[3])-1
          // init arrays...
          if(!res[m[1]])res[m[1]]=[]
          if(!res[m[1]][m[2]])res[m[1]][m[2]]=[]

          res[m[1]][m[2]][m[3]]=data
        } else {   // TRACK
          m[5]=parseInt(m[5])-1
          
          // init array...
          if(!res[m[4]])res[m[4]]=[]

          res[m[4]][m[5]]=data
        }

        res.length++
        if(res.length==res.expectedLength) {
          delete res.length
          delete res.expectedLength
          callback(res)
        }
      })  
    })
  })
}

TB03Parser.parseFileContents=(fn,data) => {
  var re=/^(\w+)(?:\s*(\d+)|)\s*=\s*(?:(?:(\w+)\s*=\s*(\w+)|)\s*(?:(\w+)\s*=\s*(\w+)|)\s*(?:(\w+)\s*=\s*(\w+)|)\s*(?:(\w+)\s*=\s*(\w+)|)\s*|(\w+))\s*\n/mg
  var ret={}
  while(m=re.exec(data)) {
    var idx=m[2]
    if(!idx) { // if there's no number after the field
      ret[m[1]]=m[11]
    } else {
      idx--
      if (!ret[m[1]]) ret[m[1]]=[] // init array
      if (!ret[m[1]][idx]) ret[m[1]][idx]={} // init array
      if (m[3]) ret[m[1]][idx][m[3]]=m[4]  // read and store 1st pair of attribs
      if (m[5]) ret[m[1]][idx][m[5]]=m[6]  // read and store 2nd pair of attribs
      if (m[7]) ret[m[1]][idx][m[7]]=m[8]  // read and store 3rd pair of attribs
      if (m[9]) ret[m[1]][idx][m[9]]=m[10] // read and store 4th pair of attribs
    }
  }
  return ret
}
