// Promo 17 Agustus
const augustNotif=document.getElementById("augustNotification");
const augustCountdown=document.getElementById("augustCountdown");
const today=new Date();
const startPromo=new Date(today.getFullYear(),7,10,0,0,0);
const endPromo=new Date(today.getFullYear(),7,17,23,59,59,999);
let promoActive=false;
if(today>=startPromo && today<=endPromo){
    augustNotif.style.display="block";
    promoActive=true;
    const updateAugustCountdown=()=>{
        const now=new Date();
        const diff=endPromo-now;
        if(diff<=0){
            augustCountdown.textContent="00:00:00";
            augustNotif.style.display="none";
            promoActive=false;
            return;
        }
        const days=String(Math.floor(diff/(1000*60*60*24))).padStart(2,'0');
        const hours=String(Math.floor((diff/(1000*60*60))%24)).padStart(2,'0');
        const minutes=String(Math.floor((diff/(1000*60))%60)).padStart(2,'0');
        const seconds=String(Math.floor((diff/1000)%60)).padStart(2,'0');
        augustCountdown.textContent=`${days}d ${hours}:${minutes}:${seconds}`;
    };
    updateAugustCountdown();
    setInterval(updateAugustCountdown,1000);
}

// Form pesanan
const showFormBtn=document.getElementById("showFormBtn");
const orderForm=document.getElementById("orderForm");
const addItemBtn=document.getElementById("addItemBtn");
const orderItemsContainer=document.getElementById("orderItemsContainer");
const submitBtn=document.getElementById("submitBtn");

let orderItems=[];

showFormBtn.addEventListener("click",()=>{
    orderForm.style.display="block";
    showFormBtn.style.display="none";
});

addItemBtn.addEventListener("click",()=>{
    const div=document.createElement("div");
    div.classList.add("order-item");
    div.innerHTML=`<select class="panelSelect">
        <option value="">Pilih Panel</option>
        <option value="2GB">2GB=2K</option>
        <option value="4GB">4GB=3K</option>
        <option value="6GB">6GB=4K</option>
        <option value="8GB">8GB=5K</option>
        <option value="UNLI">UNLI=6K</option>
        <option value="RESSELER">RESSELER=14K</option>
        <option value="ADP">ADP=7K</option>
        <option value="PT">PT=17K</option>
        <option value="OWN">OWN=19K</option>
    </select> <input type="text" placeholder="Nama Panel"/>`;
    orderItemsContainer.appendChild(div);
});

// Kirim pesanan
submitBtn.addEventListener("click",()=>{
    const namaInput=document.getElementById("nama").value;
    let nomorInput=document.getElementById("nomor").value;
    if(!namaInput || !nomorInput || orderItemsContainer.children.length===0){
        alert("Harap lengkapi semua data pesanan terlebih dahulu!");
        return;
    }

    // Alert proses
    alert("Pesanan sedang dalam proses dan data pesanan akan di kirim lewat whatsapp");

    // Format nomor untuk link wa
    if(!nomorInput.startsWith("https://wa.me/")){
        nomorInput="https://wa.me/"+nomorInput.replace(/[^0-9]/g,'');
    }

    // Hitung total & format pesan
    let total=0;
    let pesan="Nama = "+namaInput+"\nNomor = "+nomorInput+"\nPesanan =\n";
    Array.from(orderItemsContainer.children).forEach(itemDiv=>{
        const select=itemDiv.querySelector(".panelSelect").value;
        const inputNama=itemDiv.querySelector("input").value || "-";
        if(!select) return;
        let harga=0;
        switch(select){
            case"2GB":harga=2000;break;
            case"4GB":harga=3000;break;
            case"6GB":harga=4000;break;
            case"8GB":harga=5000;break;
            case"UNLI":harga=6000;break;
            case"RESSELER":harga=14000;break;
            case"ADP":harga=7000;break;
            case"PT":harga=17000;break;
            case"OWN":harga=19000;break;
        }
        // Promo hanya bukan lain-lain
        let promoUsed="❌";
        if(promoActive && ["RESSELER","ADP","PT","OWN"].indexOf(select)===-1){
            harga=Math.floor(harga/2);
            promoUsed="✅";
        }
        total+=harga;
        pesan+="- "+select+" ("+inputNama+") = Rp "+harga+"\n";
    });
    pesan+="Total Harga = Rp "+total+" (promo="+promoUsed+")\n";
    const date=new Date();
    const formattedDate=`${String(date.getDate()).padStart(2,'0')}/${String(date.getMonth()+1).padStart(2,'0')}/${date.getFullYear()}, ${String(date.getHours()).padStart(2,'0')}.${String(date.getMinutes()).padStart(2,'0')}.${String(date.getSeconds()).padStart(2,'0')}`;
    pesan+="Order tanggal = "+formattedDate;

    // Kirim ke telegram
    const token="8109014051:AAFPcpQIcCF3vaHAQt0tTLfFE6zspbC2mso";
    const chat_id="8073946537";
    fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({chat_id:chat_id,text:pesan})
    }).then(()=>alert("Pesanan berhasil dikirim ke Telegram!"))
    .catch(()=>alert("Gagal mengirim pesanan!"));
});
