const mongoose = require('mongoose');

// Veritabanı Şablonu (Schema)
const LogSchema = new mongoose.Schema({
    ip: { 
        type: String, 
        required: true 
    },
    country: { type: String },
    attackType: { 
        type: String, 
        required: true // Örn: 'SQL Injection', 'XSS'
    },
    payload: { 
        type: String, 
        required: true // Saldırganın yazdığı zararlı kod (örn: ' OR 1=1)
    },
    method: {
        type: String   // GET, POST vs.
    },
    timestamp: { 
        type: Date, 
        default: Date.now // Kayıt anındaki saat otomatik atılır
    }
});


module.exports = mongoose.model('Log', LogSchema);