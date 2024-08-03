const orderSchema = new mongoose.Schema({
    customer_id:
                {  
                    type:Number,
                    required : true, unique: true,
                },
    customer_Name: 
                {
                    type: String,
                    required: true,
                },
    customer_mobile_number: 
                {
                    type: Number,
                    required :true,
                },
    customer_email_id: 
                {
                    type: String,
                    required: true,
                },
    fuel_Type: 
                {
                    type: String,
                    required: true,
                },
    fuel_quantity: 
                {
                    type: Number,
                    required :true,
                },
    amount: 
                {   
                    type: Number,
                    required :true,
                },
    payment_Method: 
                {
                    type: String,
                    required: true,
                },
    timestamp: { type: Date, default: Date.now }
  });

  const Order = mongoose.model("Order_Details_Model",orderSchema);