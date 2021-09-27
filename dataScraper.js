//DATA SCRAPER-RECRUITMENT TASK FOR SYNERISE
//SCRIPT SCRAPES DATA FROM ALLEGRO.PL  https://allegro.pl/ AND SAVES IT TO THE LOCAL STORAGE
//SCRIPT WAS BULIT AND TESTED USING GOOGLE CHROME BROWSER IN DESKTOP VIEW MODE AND MIGHT NOT WORK WITH OTHER BROWSERS

let product = {
    url:'',
    photoUrl: [],
    productName:'',
    price:'',
    sellerName: '',
    isSuperSeller:false,
    parameters:[],
}
//get window's url
product.url = document.URL

//get information about sellers username, and superSeller(super-sprzedawca) status
const productInfo=document.querySelector("div._9a071_1hu0a._1bo4a._xu6h2._m7qxj._9a071_Em-aO > div._bphif._rym7o._9a071_1Lf_o > div:nth-child(3)").children
let sellerName
//all of the information are stored in the same div, its length will determine if user has superSeller status
if (productInfo.length > 3) {
    //superSeller badge visible-extra element in div
    product.isSuperSeller = true
    //split tle last element since sellers name and rating are stored in the same div and we won't be using the latter
    sellerName=productInfo[3].innerText.split(' ')
}
else {
    sellerName=productInfo[2].innerText.split(' ')
}
//save only user's name
product.sellerName=sellerName[0]

//get product name
product.productName = document.querySelector("h1._1s2v1").innerHTML

//get urls of all the images from the slider gallery
let productImages = document.querySelectorAll("._b8e15_2LNko")
productImages.forEach(image => {
    product.photoUrl.push(image.src)
})

//decimal places are separated from the integer part need to be joined
let priceData = document.querySelector("div._1svub._lf05o.mpof_vs.munh_8.mp4t_4").children
priceData=[...priceData]
let price= priceData.map((number) => {
    //remove whitespace and currency symbol
    return Number(number.innerHTML.replace(/\D/g,''))
})
//join integer and decimal places
product.price = price[0] + price[1] / 100

//parameters describing the object
let parameters = document.querySelectorAll("body > div.main-wrapper > div > div > div > div > div > div > div > ul > li > div > div > ul > li > div")
parameters=[...parameters]
parameters = parameters.map((parameter) => {
    return parameter.children
})
//return array of parameters
product.parameters=parameters.map((parameter) => {
    parameter = [...parameter]
    //since one parameter can have multiple values they need to be split
    let value=parameter[1].innerText.split(',')
    const parameterData= {
        parameter: parameter[0].innerText,
        value: value,
    }
    return parameterData
})
//load existing products from local storage, add new product and save
let savedProducts = JSON.parse(localStorage.getItem("scrapedData"))
let productsToSave
if (savedProducts) {
    savedProducts.push(product)
}
else {
    //if none of the products are saved, create empty array
    savedProducts=[]
    savedProducts[0]=product
}
const productsToSaveJSON=JSON.stringify(savedProducts)
localStorage.setItem("scrapedData", productsToSaveJSON)
