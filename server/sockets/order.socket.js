const { AppError } = require("../middlewares/errorhandler");
const { verifyToken } = require("../service/jwt.service");
const { getByOrderCodeService } = require("../service/order.service");
const { canAccessOrder } = require("../service/orderauth.service");

function initOrderSocket(io){
    io.use((socket, next)=>{
        try {
            const token = socket.handshake.auth.token;
            if(!token) throw new AppError("No token", 404);

            const decoded = verifyToken(token);
            socket.user = decoded;
            next();
        } catch (error) {
            next(new AppError("Unauthorized connection", 403));
        }
    })


    io.on("connection", ( socket )=>{
        console.log("...Client connected...", socket.user.id);

        socket.on("join_order_room", async (orderCode) =>{
            const allowed = await canAccessOrder( orderCode, socket.user );
            if(allowed){
                socket.join(orderCode);
            }else{
                throw new AppError("Unauthorized room join attempt!");
            }   
        });

        socket.on('disconnect', ()=>{
            console.log("...Client disconnected...", socket.id);
        })
        
    })
} 

module.exports = { initOrderSocket }