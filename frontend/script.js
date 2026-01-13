const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");

const AVALANCHE_FUJI_CHAIN_ID = "0xa869"; // Fuji Testnet

let isConnected = false;

function formatAvaxBalance(balanceWei) {
  if (!balanceWei) return "0.0000";
  const balance = parseInt(balanceWei, 16);
  return (balance / 1e18).toFixed(4);
}

// Reset tampilan ke keadaan awal
function resetUI() {
  statusEl.textContent = "Not connected";
  statusEl.style.color = "#ccc";
  addressEl.textContent = "-";
  networkEl.textContent = "-";
  balanceEl.textContent = "-";
}

// Perbarui info dompet (alamat, jaringan, saldo)
async function updateWalletInfo() {
  try {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    const address = accounts[0];

    if (!address) {
      disconnectWallet();
      return;
    }

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    addressEl.textContent = address;

    if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
      networkEl.textContent = "Avalanche Fuji Testnet";
      statusEl.textContent = "Connected ✅";
      statusEl.style.color = "#4cd137";

      const balanceWei = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      balanceEl.textContent = formatAvaxBalance(balanceWei);
    } else {
      networkEl.textContent = "Wrong Network ❌";
      statusEl.textContent = "Please switch to Avalanche Fuji";
      statusEl.style.color = "#fbc531";
      balanceEl.textContent = "-";
    }
  } catch (error) {
    console.error("Failed to update wallet info:", error);
    resetUI();
  }
}

// Hubungkan wallet
async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Core Wallet tidak terdeteksi. Silakan install Core Wallet.");
    return;
  }

  try {
    statusEl.textContent = "Connecting...";
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts || accounts.length === 0) {
      resetUI();
      return;
    }

    isConnected = true;
    connectBtn.textContent = "Disconnect";

    // Pasang listener untuk perubahan akun & jaringan
    window.ethereum.on("accountsChanged", updateWalletInfo);
    window.ethereum.on("chainChanged", updateWalletInfo);

    await updateWalletInfo();
  } catch (error) {
    console.error("Connection failed:", error);
    statusEl.textContent = "Connection Failed ❌";
    statusEl.style.color = "#e84118";
  }
}

// Putuskan koneksi & cabut izin
async function disconnectWallet() {
  // Coba cabut izin akses (fitur modern)
  if (window.ethereum && typeof window.ethereum.request === "function") {
    try {
      await window.ethereum.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }],
      });
      console.log("Permissions revoked successfully");
    } catch (revokeError) {
      console.warn("wallet_revokePermissions not supported:", revokeError);
    }
  }

  // Hapus listener
  if (window.ethereum?.removeListener) {
    window.ethereum.removeListener("accountsChanged", updateWalletInfo);
    window.ethereum.removeListener("chainChanged", updateWalletInfo);
  }

  // Reset state
  isConnected = false;
  connectBtn.textContent = "Connect";
  resetUI();
  
  console.log("Wallet disconnected - Refresh halaman untuk connect wallet lain");
}

// Handler utama untuk tombol
function handleButtonClick() {
  if (isConnected) {
    disconnectWallet();
  } else {
    connectWallet();
  }
}

// Cek apakah sudah terhubung saat halaman dimuat
window.addEventListener("load", async () => {
  // Cek apakah ada wallet yang terinstall
  if (typeof window.ethereum === "undefined") {
    resetUI();
    return;
  }

  try {
    // Cek apakah sudah ada akun yang terkoneksi
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    
    if (accounts.length > 0) {
      // Jika ada akun terkoneksi, tampilkan info tapi biarkan tombol "Connect"
      // sehingga user bisa ganti akun dengan klik Connect lagi
      isConnected = true;
      connectBtn.textContent = "Disconnect";
      
      // Pasang listener
      window.ethereum.on("accountsChanged", updateWalletInfo);
      window.ethereum.on("chainChanged", updateWalletInfo);
      
      // Update info wallet
      await updateWalletInfo();
    } else {
      // Tidak ada akun terkoneksi, mulai dari awal
      resetUI();
      connectBtn.textContent = "Connect";
      isConnected = false;
    }
  } catch (error) {
    console.error("Error checking connection:", error);
    resetUI();
  }
});

// Inisialisasi tombol dengan satu event listener
connectBtn.addEventListener("click", handleButtonClick);