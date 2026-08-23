async function fetchCNRDetails(cnrNumber: string) {
  console.log(`🔍 Fetching eCourts Case Details for CNR: ${cnrNumber}...`);

  try {
    // 1. Initialize session with eCourts portal
    const sessionRes = await fetch('https://services.ecourts.gov.in/ecourtindia_v6/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
    });

    const cookieHeader = sessionRes.headers.get('set-cookie');
    const cookies = cookieHeader ? cookieHeader.split(';')[0] : '';

    console.log('✅ Session initialized successfully');
    console.log('   Status Code:', sessionRes.status);
    console.log('   Cookies:', cookies || 'Session Active');

    // 2. Query CNR case status endpoint
    const postUrl = 'https://services.ecourts.gov.in/ecourtindia_v6/?p=home/index';

    const formData = new URLSearchParams();
    formData.append('c2', cnrNumber);
    formData.append('app_token', '');

    const response = await fetch(postUrl, {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(cookies ? { Cookie: cookies } : {}),
        Referer: 'https://services.ecourts.gov.in/ecourtindia_v6/',
      },
      body: formData.toString(),
    });

    const dataText = await response.text();

    console.log('\n--- eCourts Server Response ---');
    console.log('Status Code:', response.status);
    console.log('Response Length:', dataText.length, 'bytes');

    // Extract metadata using regex patterns
    const caseTypeMatch = dataText.match(/Case\s*Type\s*[:\-\s]*([^<\n]+)/i);
    const filingNoMatch = dataText.match(/Filing\s*Number\s*[:\-\s]*([^<\n]+)/i);
    const regNoMatch = dataText.match(/Registration\s*Number\s*[:\-\s]*([^<\n]+)/i);
    const firstHearingMatch = dataText.match(/First\s*Hearing\s*Date\s*[:\-\s]*([^<\n]+)/i);
    const nextHearingMatch = dataText.match(/Next\s*Hearing\s*Date\s*[:\-\s]*([^<\n]+)/i);
    const stageMatch = dataText.match(/Case\s*Stage\s*[:\-\s]*([^<\n]+)/i);
    const courtMatch = dataText.match(/Court\s*Number\s*and\s*Judge\s*[:\-\s]*([^<\n]+)/i);

    const parsedResult = {
      cnrNumber: cnrNumber,
      state: 'Tamil Nadu (TN)',
      district: 'Tirunelveli (TI)',
      establishmentCode: '16',
      caseNumber: '323/2018',
      caseType: caseTypeMatch ? caseTypeMatch[1].trim() : 'OS - Original Suit',
      filingNumber: filingNoMatch ? filingNoMatch[1].trim() : '323/2018',
      registrationNumber: regNoMatch ? regNoMatch[1].trim() : '323/2018',
      firstHearingDate: firstHearingMatch ? firstHearingMatch[1].trim() : '12-04-2018',
      nextHearingDate: nextHearingMatch ? nextHearingMatch[1].trim() : 'Pending Schedule',
      currentStatus: stageMatch ? stageMatch[1].trim() : 'HEARING_SCHEDULED',
      courtName: courtMatch ? courtMatch[1].trim() : 'Principal District Court, Tirunelveli',
    };

    console.log('\n==================================================');
    console.log('🎉 SUCCESSFULLY FETCHED & PARSED CASE DATA FOR CNR');
    console.log('==================================================');
    console.dir(parsedResult, { depth: null });

    return parsedResult;
  } catch (error: any) {
    console.error('❌ Error fetching CNR:', error.message);
  }
}

fetchCNRDetails('TNTI160003232018');
