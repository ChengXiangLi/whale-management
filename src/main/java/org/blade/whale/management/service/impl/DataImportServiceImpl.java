package org.blade.whale.management.service.impl;

import java.io.File;
import java.util.Arrays;
import java.util.List;

import org.blade.whale.ImportException;
import org.blade.whale.dataimport.DataImport;
import org.blade.whale.management.service.DataImportService;
import org.blade.whale.util.PathUtil;

public class DataImportServiceImpl implements DataImportService {

	public void importData(String dataType, String fileName) throws ImportException {
		DataImport.dataImport(fileName, dataType);
	}

	@Override
	public List<String> listImportFiles(String dataType) {
		String folderPath = PathUtil.getWebInfPath() + File.separator + DataImport.IMPORT_FILE_BASE_PATH + File.separator + dataType;
		File folder = new File(folderPath);
		return Arrays.asList(folder.list());
	}

	@Override
	public void deleteFile(String dataType, String filePath)
			throws ImportException {
		DataImport.deleteFile(filePath, dataType);
	}
}
