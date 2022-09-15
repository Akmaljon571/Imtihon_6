import http from "http"
import { root, white } from "./utils/FS.js"

const option = {
    "Content-Type": "application/json"
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
            return res.end(JSON.stringify(root("market.json")))
        }

        if (req.url.split("/")[1] == "market") {
            const branch = Branch.filter(b => b.marketId == urlId )
            const productsiya = Product.filter(p => p.branchId == urlId)
            const workers = Workers.filter(w => w.branchId == urlId)

            let asosiy = Market.find(e => e.id == urlId ? e : null)
            asosiy.branchlari = branch;
            asosiy.ishchilari = workers;
            asosiy.mahsulotlar = productsiya;

            res.writeHead(200, option)
            return res.end(JSON.stringify(asosiy))         
        }
        // Market



        if (req.url.split("/")[1] == "branch") {            
            let asosiy = Branch.filter(e => e.id == urlId ? e.makro = Market.find(b => e.marketId == b.id ) : null)
            asosiy = asosiy.filter(e => e.id == urlId && Product.filter(b => e.id == b.branchId ).length ? e.mahsulot = Product.filter(b => e.id == b.branchId ): e.mahsulot = "Hozircha Mahsulot yoq")
            asosiy = asosiy.filter(e => e.id == urlId && Workers.filter(b => e.id == b.branchId ).length ? e.ishchi = Workers.filter(b => e.id == b.branchId ) : e.ishchi = "Hozircha ishchilar yoq")


            res.writeHead(200, option)
            return res.end(JSON.stringify(asosiy))         
        }
        // branch




        if (req.url.split("/")[1] == "product") {
            let productBrand = Product.filter(e => e.id == urlId ? e.brand = Branch.find(b => e.branchId == b.id ) : null)

            let asosiy = productBrand.filter(e => e.id == urlId ? e.makro = Market.find(b => e.brand.marketId == b.id ) : null)
            asosiy = asosiy.filter(e => e.id == urlId ? e.ishchilar = Workers.find(b => e.branchId == b.branchId ) : null)
            res.writeHead(200, option)
            return res.end(JSON.stringify(asosiy))         
        }
        //product
        
        

        if (req.url.split("/")[1] == "workers") {
            let productBrand = Workers.filter(e => e.id == urlId ? e.brand = Branch.find(b => e.branchId == b.id) : null)
            let asosiy = productBrand.filter(e => e.id == urlId ? e.makro = Market.find(b => e.brand.marketId == b.id ) : null)
            asosiy = asosiy.filter(e => e.id == urlId ? e.product = Product.filter(b => e.branchId == b.branchId ) : null)
            res.writeHead(200, option)
            return res.end(JSON.stringify(asosiy))          
        }
        // workers

        return
    }


    
    res.on("Ok")
}).listen(8080, console.log(8080))






// get /module
//get /module/1
//get /branch/1
//get /product/1
//get /workers/1