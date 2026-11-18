const API_BASE = "/api/clients";

 function showError(message) {
   const el = document.getElementById("create-error");
   el.textContent = message;
   el.classList.remove("hidden");
 }

 function clearError() {
   const el = document.getElementById("create-error");
   el.textContent = "";
   el.classList.add("hidden");
 }

 const form = document.getElementById("create-form");
 const submitBtn = document.getElementById("create-submit");

 form.addEventListener("submit", async (event) => {
   event.preventDefault();
   clearError();

   const nickname = document.getElementById("create-nickname").value.trim();
   if (nickname.length < 2 || nickname.length > 30) {
     showError("Nickname must have between 2 and 30 characters.");
     return;
   }

   submitBtn.disabled = true;
   try {
     const response = await fetch(API_BASE, {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ nickname })
     });

     if (response.status === 201) {
       const client = await response.json();
       document.getElementById("new-client-ref").textContent = client.clientRef;
       document.getElementById("create-success").classList.remove("hidden");
       form.classList.add("hidden");
     } else {
       let message = "Could not create the account. Try again.";
       try {
         const body = await response.json();
         if (body.error) message = body.error;
       } catch {}
       showError(message);
     }
   } catch {
     showError("Connection error. Check your network and try again.");
   } finally {
     submitBtn.disabled = false;
   }
 });
