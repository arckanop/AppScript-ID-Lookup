function doGet() {
	getData();
	return HtmlService.createHtmlOutputFromFile("index.html");
}

function getData() {
	const cache = CacheService.getScriptCache();
	const cached = cache.get("idMap");
	if (cached) return JSON.parse(cached);

	const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Main");
	const values = sheet.getDataRange().getValues();

	const idMap = Object.create(null);

	for (let i = 1; i < values.length; i++) {
		const id = String(values[i][2]).trim();
		if (!id) continue;

		idMap[id] = {
			row: i + 1,
			timestamp: values[i][0] ? String(values[i][0]) : "",
			name: String(values[i][1] ?? ""),
			status: String(values[i][3] ?? ""),
			notes: String(values[i][4] ?? ""),
		};
	}

	try {
		cache.put("idMap", JSON.stringify(idMap), 60);
	} catch (e) {
		Logger.log("Cache put failed: " + e.message);
	}

	return idMap;
}

function findID(ID) {
	try {
		const idMap = getData();
		const key = String(ID).trim();

		if (Object.prototype.hasOwnProperty.call(idMap, key)) {
			const entry = idMap[key];
			return {
				found: true,
				row: entry.row,
				timestamp: entry.timestamp,
				name: entry.name,
				status: entry.status,
				notes: entry.notes,
			};
		}

		return { found: false };
	} catch (error) {
		return { found: false, error: error.message };
	}
}

function setStatus(row, value) {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Main");
	sheet.getRange(row, 4).setValue(value);

	CacheService.getScriptCache().remove("idMap");
}

function addID(id) {
	const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Main");
	const row = sheet.getLastRow() + 1;
	sheet.getRange(row, 1).setValue(new Date());
	sheet.getRange(row, 2).setValue("-");
	sheet.getRange(row, 3).setValue(id);
	sheet.getRange(row, 4).setValue("TRUE");
	sheet.getRange(row, 5).setValue("Added from Coupon");

	CacheService.getScriptCache().remove("idMap");
}

/*
function myFunction() {
	Logger.log(findID("33142"));
}
*/