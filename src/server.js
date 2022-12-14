import http from "http"
import { root, white } from "./utils/FS.js"

const option = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
}

const func = (status, data) => {
    return JSON.stringify({
        "status": status,
        "data": data
    })
}

http.createServer((req, res) => {
    const urlId = req.url.split("/")[2]
    const eskiMarket = JSON.stringify(root("market.json"))
    const eskiBranch = JSON.stringify(root("branch.json"))
    const eskiproduct = JSON.stringify(root("product.json"))
    const eskiworkers = JSON.stringify(root("workers.json"))
    const Market = JSON.parse(eskiMarket)
    const Branch = JSON.parse(eskiBranch)
    const Product = JSON.parse(eskiproduct)
    const Workers = JSON.parse(eskiworkers)

    if (req.method == "GET") {
        if (req.url == "/markets") {
            res.writeHead(200, option)
            return res.end(func(200, root("market.json")))
        }

        if (req.url.split("/")[1] == "market") {
            const branch = Branch.filter(b => b.marketId == urlId )
            branch.map(e => e.mahsulotlari = Product.filter(p => p.branchId == e.id))
            branch.map(e => e.ishchilar = Workers.filter(p => p.branchId == e.id))



            let asosiy = Market.find(e => e.id == urlId ? e : null)
            asosiy.branchlari = branch;
            

            res.writeHead(200, option)
            return res.end(func(200, asosiy))         
        }
        // Market



        if (req.url.split("/")[1] == "branch") {            
            let asosiy = Branch.filter(e => e.id == urlId ? e.makro = Market.find(b => e.marketId == b.id ) : null)
            asosiy = asosiy.filter(e => e.id == urlId && Product.filter(b => e.id == b.branchId ).length ? e.mahsulot = Product.filter(b => e.id == b.branchId ): e.mahsulot = "Hozircha Mahsulot yoq")
            asosiy = asosiy.filter(e => e.id == urlId && Workers.filter(b => e.id == b.branchId ).length ? e.ishchi = Workers.filter(b => e.id == b.branchId ) : e.ishchi = "Hozircha ishchilar yoq")


            res.writeHead(200, option)
            return res.end(func(200, asosiy))         
        }
        // branch




        if (req.url.split("/")[1] == "product") {
            let productBrand = Product.filter(e => e.id == urlId ? e.brand = Branch.find(b => e.branchId == b.id ) : null)

            let asosiy = productBrand.filter(e => e.id == urlId ? e.makro = Market.find(b => e.brand.marketId == b.id ) : null)
            asosiy = asosiy.filter(e => e.id == urlId ? e.ishchilar = Workers.find(b => e.branchId == b.branchId ) : null)
            res.writeHead(200, option)
            return res.end(func(200, asosiy))         
        }
        //product
        
        

        if (req.url.split("/")[1] == "workers") {
            let productBrand = Workers.filter(e => e.id == urlId ? e.brand = Branch.find(b => e.branchId == b.id) : null)
            let asosiy = productBrand.filter(e => e.id == urlId ? e.makro = Market.find(b => e.brand.marketId == b.id ) : null)
            asosiy = asosiy.filter(e => e.id == urlId ? e.product = Product.filter(b => e.branchId == b.branchId ) : null)
            res.writeHead(200, option)
            return res.end(func(200, asosiy))          
        }
        // workers

        return
    }

    if (req.method == "POST") {
        if (req.url == "/pushMarket") {
            req.on("data", chunk => {
                const { title } = JSON.parse(chunk)
                const newObj = {
                    id: Market.at(-1)?.id + 1 || 1,
                    title
                }
                Market.push(newObj)
                white("market.json", Market)
            })
            res.writeHead(201, option)
            res.end(JSON.stringify({
                "status": "201",
                "message": "Oka market muaffaqiyatli qoshildi"
            }))
        }
        // post Market
        if (req.url == "/pushBranch") {
            req.on("data", chunk => {
                const { title, marketId } = JSON.parse(chunk)
                const newObj = {
                    id: Branch.at(-1)?.id + 1 || 1,
                    title,marketId
                    
                }
                Branch.push(newObj)
                white("branch.json", Branch)
            })
            res.writeHead(201, option)
            res.end(JSON.stringify({
                "status": "201",
                "message": "Oka branch muaffaqiyatli qoshildi"
            }))
        }
        // post Branch
        if (req.url == "/pushProduct") {
            req.on("data", chunk => {
                const { title, branchId, narx  } = JSON.parse(chunk)
                const newObj = {
                    id: Product.at(-1)?.id + 1 || 1,
                    title,narx,branchId
                }
                Product.push(newObj)
                white("product.json", Product)
            })
            res.writeHead(201, option)
            res.end(JSON.stringify({
                "status": "201",
                "message": "Oka Produksiya muaffaqiyatli qoshildi"
            }))
        }
        // post Product
        if (req.url == "/pushWorkers") {
            req.on("data", chunk => {
                const { name, maosh, staj, branchId } = JSON.parse(chunk)
                const newObj = {
                    id: Workers.at(-1)?.id + 1 || 1,
                    name,maosh,staj, branchId
                }
                Workers.push(newObj)
                white("workers.json", Workers)
            })
            res.writeHead(201, option)
            res.end(JSON.stringify({
                "status": "201",
                "message": "Oka Ishchilar muaffaqiyatli qoshildi"
            }))
        }
        // post Workers
        return
    }

    if (req.method == "PUT") {
        if (req.url.split("/")[1] == "putMarket") {
            req.on("data", chunk => {
                const { title } = JSON.parse(chunk)
                const newObj = {
                    id: Number(urlId),
                    title
                }
                const uploadMarket = Market.map(e => e.id == urlId ? newObj : e)
                white("market.json", uploadMarket)
            })
            res.writeHead(201, option)
            res.end(JSON.stringify({
                "status": "201",
                "message": "Oka market muaffaqiyatli ozgardi"
            })) 
        }
        // put Market

        if (req.url.split("/")[1] == "putBranch") {
            req.on("data", chunk => {
                const { title, marketId } = JSON.parse(chunk)
                const newObj = {
                    id: Number(urlId),
                    title,
                    marketId 
                }
                const uploadBranch = Branch.map(e => e.id == urlId ? newObj : e)
                white("branch.json", uploadBranch)
            })
            res.writeHead(201, option)
            res.end(JSON.stringify({
                "status": "201",
                "message": "Oka Branch muaffaqiyatli ozgardi"
            }))
        }   
        //  put Branch
        if (req.url.split("/")[1] == "putProduct") {
            req.on("data", chunk => {
                const { title,narx, branchId } = JSON.parse(chunk)
                const newObj = {
                    id: Number(urlId),
                    title,
                    narx,
                    branchId 
                }
                const uploadProduct = Product.map(e => e.id == urlId ? newObj : e)
                white("product.json", uploadProduct)
            })
            res.writeHead(201, option)
            res.end(JSON.stringify({
                "status": "201",
                "message": "Oka Produksiya muaffaqiyatli ozgardi"
            })) 
        }
        // put Product

        if (req.url.split("/")[1] == "putIshchi") {
            req.on("data", chunk => {
                const { name, maosh, staj, branchId } = JSON.parse(chunk)
                const newObj = {
                    id: Number(urlId),
                    name,
                    maosh,
                    staj,
                    branchId 
                }
                const uploadIshchi = Workers.map(e => e.id == urlId ? newObj : e)
                white("workers.json", uploadIshchi)
            })
            res.writeHead(201, option)
            res.end(JSON.stringify({
                "status": "201",
                "message": "Oka Ishchilar muaffaqiyatli ozgardi"
            })) 
        }
        // put Product

        return
    }

    if (req.method == "DELETE") {
        if (req.url.split("/")[1] == "delMarket") {
           const delMarket = Market.filter(e => e.id != urlId);
           white("market.json", delMarket)
           const delBranch = Branch.filter(e => e.marketId != urlId )
           white("branch.json", delBranch)
           const delProduct = Product.
           
           
           filter(e => e.branchId != urlId )
           white("product.json", delProduct)
           const delWorkers = Workers.filter(e => e.branchId != urlId )
           white("workers.json", delWorkers)

           res.writeHead(201, option)
           res.end(JSON.stringify({
               "status": "201",
               "message": "Oka market muaffaqiyatli ochirildi"
           }))
        }
        // delete Market
        if (req.url.split("/")[1] == "delBranch") {
           const delBranch = Branch.filter(e => e.id != urlId )
           white("branch.json", delBranch)
           const delProduct = Product.filter(e => e.branchId != urlId )
           white("product.json", delProduct)
           const delWorkers = Workers.filter(e => e.branchId != urlId )
           white("workers.json", delWorkers)
           res.writeHead(201, option)
           res.end(JSON.stringify({
               "status": "201",
               "message": "Oka Branch muaffaqiyatli ochirildi"
           }))
        }
        // delete Branch
        if (req.url.split("/")[1] == "delProduct") {
           const delProduct = Product.filter(e => e.id != urlId);
           white("product.json", delProduct)
           res.writeHead(201, option)
           res.end(JSON.stringify({
               "status": "201",
               "message": "Oka Produc muaffaqiyatli ochirildi"
           }))
        }
        // delete Product
        if (req.url.split("/")[1] == "deleteIshchi") {
           const delIshchi = Workers.filter(e => e.id != urlId);
           white("workers.json", delIshchi)
           res.writeHead(201, option)
           res.end(JSON.stringify({
               "status": "201",
               "message": "Oka Ishchilar muaffaqiyatli ochirildi"
           }))
        }
        // delete Ishchilar
        return
    }

    
    res.on("Ok")
}).listen(8080, console.log(8080))





//get /maket/1 
//get /branch/1
//get /product/1
//get /workers/1

// POST /module
// POST /branch
// POST /product
// POST /workers

// PUT /module
// PUT /branch
// PUT /product
// PUT /workers