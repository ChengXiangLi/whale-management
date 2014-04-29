package org.blade.whale.management.service;

import java.util.List;

import org.blade.whale.ImportException;

public interface DataImportService {
	
	public void importData(String dataType, String filePath)  throws ImportException ;
	
	public void deleteFile(String dataType, String filePath)  throws ImportException ;
	
	public List<String> listImportFiles(String dataType);
}
