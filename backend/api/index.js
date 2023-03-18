const app = require("../app");
const dotenv = require('dotenv');

dotenv.config({path: "backend/config/.env"});

const connectDatabase = require("../config/database");
const cloudinary = require('cloudinary');

//Handling Uncaught Exception
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down due to Uncaught Exception`);
    process.exit(1);
}); 

app.get('/', async(req, res) => {
    return res.status(200).json({
        message: "I'm A Ecommerce Site to be built"
    });
});

//Connecting the Database
connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const PORT = process.env.PORT || 3100;
const hostname = 'mahal.com'; 
const server = app.listen(PORT, () => {
    console.log(`Server is Running from port http://${hostname}:${process.env.PORT}`);
});


//Unhandled Error Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down due to Unhandled Error Rejection`);

    server.close(()=> {
        process.exit(1);
    });
});





// const user = {
//     firstname: "Toriqul",
//     lastname: "Mahal",
//     details:[
//         {
//             age: 25,
//             dateOfBirth: "25/10/1998",
//             religion: "Muslim"
//         },
//         {
//             occupation: "Job-seeker"
//         }
//     ]
// }

    
//     // console.log(Object.keys(user));
//     Object.keys(user).forEach(key => {
//         // console.log(user[key]);
//         let n = user[key].length; 
//         let arr = [];
//         for(let i = 0; i < n; i++){
//             // console.log(user[key][i]);
//             let p = [user[key][i]];
//             // console.log(p); 
//             // console.log(p[i]);
//             arr = arr.concat(p);
//             console.log(arr);
//         } 
//     })