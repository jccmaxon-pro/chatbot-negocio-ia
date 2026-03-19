async function loadLeads() {
  const response = await fetch("/leads");
  const leads = await response.json();

  const tbody = document.getElementById("leads-body");
  tbody.innerHTML = "";

  leads.forEach(lead => {
    tbody.innerHTML += `
      <tr>
        <td>${lead.business}</td>
        <td>${lead.name}</td>
        <td>${lead.phone}</td>
        <td>${lead.email}</td>
        <td>${lead.message}</td>
      </tr>
    `;
  });
}

window.onload = loadLeads;