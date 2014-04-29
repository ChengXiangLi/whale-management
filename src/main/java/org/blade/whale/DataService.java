package org.blade.whale;

import java.util.List;

import org.blade.whale.dataexport.DataExport;
import org.blade.whale.dataimport.DataImport;

public class DataService {

	public static void importData(String importPath, String tableName)
			throws ImportException {
		DataImport.dataImport(importPath, tableName);
	}

	public static void exportData(String exportFields, String queryCondition,
			String outputPath, String tableName) throws ExportException {
		DataExport.exportData(tableName, exportFields, queryCondition);
	}

	public static List<List<String>> query(String queryFields,
			String queryCondition, String tableName) throws ExportException {
		return DataExport.queryData(tableName, queryFields, queryCondition);
	}
}
