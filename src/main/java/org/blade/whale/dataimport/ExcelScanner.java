package org.blade.whale.dataimport;

import java.io.File;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.blade.whale.ImportException;
import org.blade.whale.model.TableType;

public class ExcelScanner {

	private HSSFWorkbook excel = null;
	private TableType tableType = null;

	public ExcelScanner(TableType tableName, String importPath)
			throws ImportException {
		this.tableType = tableName;
		checkFile(importPath);
		try {
			excel = new HSSFWorkbook(new FileInputStream(new File(importPath)));
		} catch (Exception e) {
			throw new ImportException("Failed to read excel file[" + importPath
					+ "].", e);
		}
		checkSheet();
	}

	private void checkFile(String importPath) throws ImportException {
		File file = new File(importPath);
		if (!file.exists()) {
			throw new ImportException("Can not find file[" + importPath + "].");
		}
	}

	private void checkSheet() throws ImportException {
		int sheetNumber = excel.getNumberOfSheets();
		if (sheetNumber == 0) {
			throw new ImportException("There is no sheet in excel["
					+ excel.getDocumentSummaryInformation() + "]");
		}
	}

	public List<SheetScanner> getSheetScanners() throws ImportException {
		List<SheetScanner> sheetScanners = new ArrayList<SheetScanner>();
		for (int i = 0; i < excel.getNumberOfSheets(); i++) {
			HSSFSheet sheet = excel.getSheetAt(i);
			sheetScanners.add(new SheetScanner(this.tableType, sheet));
		}
		return sheetScanners;
	}
}
