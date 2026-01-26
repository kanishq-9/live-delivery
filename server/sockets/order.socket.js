const { AppError } = require("../middlewares/errorhandler");
const { verifyToken } = require("../service/jwt.service");
const { getByOrderCodeService } = require("../service/order.service");

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
            const order = await getByOrderCodeService(orderCode, socket.user.id, socket.user.role);
            if(order){
                socket.join(orderCode);
                console.log(`Socket joined room: ${orderCode}`)
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