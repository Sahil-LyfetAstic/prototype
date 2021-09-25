const suggesions = {
    aws:{
        name:'aws',
        details:'Amazon Web Services offers cloud web hosting solutions that provide businesses, non-profits, and governmental organizations with low-cost ways to deliver their websites and web applications. Whether you’re looking for a marketing, rich-media, or ecommerce website, AWS offers a wide-range of website hosting options, and we’ll help you select the one that is right for you.',
        link:'https://aws.amazon.com/websites/'
    },
    Digital_ocean:{
        name:'Digital ocean',
        details:'Deploy faster & scale easier with an application server that saves your team time & money. Get started with fast, secure, and reliable cloud infrastructure solutions. Try for free. Manage W/ Teams. Simple API. 55 Sec. Deploy. Scale Quickly.',
        link:'https://www.digitalocean.com/'
    },
    Google_cloud_hosting:{
        name:'Google cloud hosting',
        details:'Web hosting services from Google Cloud. Host everything from blogs to dynamic websites in the cloud with Click to Deploy or customized solutions.',
        link:'https://cloud.google.com/solutions/web-hosting'
    },
    Interserver:{
        name:'interserver',
        details:'InterServer is a web hosting provider that seeks to create an all-in-one experience for its users. It has been providing hosting services for 21 ',
        link:'https://www.interserver.net'
    },
    Hostigator:{
        name:'Hostigator',
        details:'Leading Provider of Secure & Easy Website Hosting Service. Select Your Plan & Get Started! Choose From Shared Linux, Cloud, Vps and WP Hosting and Start Building your Website Today.',
        link:'https://www.hostgator.in/'
    }

}


module.exports={

    getHostingDetails:()=>{
        return new Promise((resolve,reject)=>{
            resolve(suggesions)
        })
    }
}