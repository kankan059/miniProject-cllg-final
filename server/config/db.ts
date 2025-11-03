import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config();


const mongoConnect = async () =>{
    const mongoURI = process.env.MONGO_URI;

    if(!mongoURI){
        console.log("mongouri is not defined");
        process.exit(1);
    }
    try{
        await mongoose.connect(mongoURI);
        console.log('database connected succesfully!!');
    }
    catch(error){
        console.error('their is some connection problem' , error);
        process.exit(1);
    }
} 
export default mongoConnect