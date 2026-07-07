(async () => {
  try {
    const base = 'http://localhost:5000/api';

    console.log('GET /expenses');
    let res = await fetch(`${base}/expenses`);
    console.log('Status:', res.status);
    const list = await res.json();
    console.log(JSON.stringify(list, null, 2));

    console.log('\nPOST /expenses (création d\'une dépense de test)');
    res = await fetch(`${base}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: new Date().toISOString().slice(0, 10),
        category: 'Automated Test',
        description: 'Dépense créée par script de test',
        amount: 123,
        paymentMethod: "Espèces",
        note: 'script'
      })
    });

    console.log('Status:', res.status);
    const created = await res.json();
    console.log(JSON.stringify(created, null, 2));

    const id = created?.data?._id || created?._id;
    if (!id) {
      console.log('Aucun id retourné, arrêt des tests.');
      return;
    }

    console.log('\nGET /expenses/summary');
    res = await fetch(`${base}/expenses/summary`);
    console.log('Status:', res.status);
    console.log(JSON.stringify(await res.json(), null, 2));

    console.log(`\nDELETE /expenses/${id}`);
    res = await fetch(`${base}/expenses/${id}`, { method: 'DELETE' });
    console.log('Status:', res.status);
    console.log(await res.json());
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
})();
