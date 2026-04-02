function myFunction() {
}

function onFormSubmit(e) {
	const lock = LockService.getDocumentLock() || LockService.getScriptLock();
	lock.waitLock(30000);

	try {
		const formData = e.namedValues;
		const responseSheet = e.range.getSheet();
		const referenceSheet = responseSheet.getParent().getSheetByName('CurrentNumber');

		if (!referenceSheet) throw new Error('Sheet "CurrentNumber" not found');

		const emailAddress = formData['Email Address']?.[0] || formData['ที่อยู่อีเมล']?.[0] || '';
		const track = (formData['แผนการเรียน']?.[0] || '').trim();

		if (!track) throw new Error("Track not specified in the form response");

		const trackColumn = getColumn(track);

		const counterCell = referenceSheet.getRange(3, trackColumn);
		const currentValue = Number(counterCell.getValue()) || 0;
		const membershipNumber = currentValue + 1;

		counterCell.setValue(membershipNumber);

		const membershipIDCol = 3;
		responseSheet.getRange(e.range.getRow(), membershipIDCol).setValue(membershipNumber);

		const subject = 'ขอบคุณสำหรับการกรอกแบบฟอร์มสมัครสมาชิกและจองไซส์เสื้อ Triamudom Family';

		const plainText = generatePlainText({
			membershipNumber: membershipNumber,
			parentFirstName: formData["ชื่อผู้ปกครอง"]?.[0] || '',
			parentLastName: formData["นามสกุลผู้ปกครอง"]?.[0] || '',
			studentFirstName: formData["ชื่อนักเรียน"]?.[0] || '',
			studentLastName: formData["นามสกุลนักเรียน"]?.[0] || '',
			jerseySize: formData["ไซส์เสื้อ Jersey"]?.[0] || '-',
			jerseyText: formData["ตัวอักษรบนเสื้อ Jersey"]?.[0] || '-',
			jerseyNumber: formData["ตัวเลขบนเสื้อ Jersey"]?.[0] || '-',
			poloSize: formData["ไซส์เสื้อโปโล"]?.[0] || '-',
			poloGender: formData["เพศเสื้อโปโล"]?.[0] || '-'
		});

		const htmlBody = `
		`;

		if (emailAddress) {
			GmailApp.sendEmail(emailAddress, subject, plainText, {
				htmlBody: htmlBody,
				name: 'ทีมงานสมัครสมาชิก',
				noReply: true
			});

			responseSheet.getRange(e.range.getRow(), 32).setValue("TRUE");
		}

	} finally {
		lock.releaseLock();
	}
}

function getColumn(track) {
	switch (track) {
		case 'ภาษา - ภาษาฝรั่งเศส':
			return 2;
		case 'ภาษา - ภาษาเยอรมัน':
			return 3;
		case 'ภาษา - ภาษาญี่ปุ่น':
			return 4;
		case 'ภาษา - ภาษาจีน':
			return 5;
		case 'ภาษา - ภาษาสเปน':
			return 6;
		case 'ภาษา - ภาษาเกาหลี':
			return 7;
		case 'ภาษา - คณิตศาสตร์':
			return 8;
		case 'วิทยาศาสตร์ - คณิตศาสตร์':
			return 9;
		default:
			throw new Error("Invalid Track: " + track);
	}
}

function generatePlainText(data) {
	return `
ขอบคุณสำหรับการสมัครสมาชิก

เรียนคุณ ${data.parentFirstName} ${data.parentLastName}

ขอบคุณสำหรับการกรอกแบบฟอร์มสมัครสมาชิก Triamudom Family และจองไซส์เสื้อ
ทางเราได้รับข้อมูลของท่านเรียบร้อยแล้ว

หมายเลขสมาชิก
${data.membershipNumber}

ข้อมูลสมาชิก
- ชื่อผู้ปกครอง: ${data.parentFirstName} ${data.parentLastName}
- ชื่อนักเรียน: ${data.studentFirstName} ${data.studentLastName}

ข้อมูลเสื้อ Jersey
- ไซส์เสื้อ Jersey: ${data.jerseySize}
- ชื่อบนเสื้อ Jersey: ${data.jerseyText}
- เบอร์บนเสื้อ Jersey: ${data.jerseyNumber}

ข้อมูลเสื้อโปโล
- ไซส์เสื้อโปโล: ${data.poloSize}
- เพศเสื้อโปโล: ${data.poloGender}

หากมีข้อมูลเพิ่มเติม ทางทีมงานจะแจ้งให้ท่านทราบอีกครั้ง

ขอขอบพระคุณอีกครั้ง

อีเมลฉบับนี้ถูกส่งโดยอัตโนมัติ กรุณาอย่าตอบกลับอีเมลนี้
	`.trim();
}