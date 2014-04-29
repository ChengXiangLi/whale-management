package org.blade.whale.management.service.impl;

import java.util.List;

import org.blade.whale.ExportException;
import org.blade.whale.dataexport.DataExport;
import org.blade.whale.management.service.DataExportService;

public class DataExportServiceImpl implements DataExportService {

	@Override
	public String exportData(String tableType, String exportFields,
			String exportCondition) throws ExportException {
		return DataExport.exportData(tableType, exportFields, exportCondition);
	}

	@Override
	public List<List<String>> queryData(String tableType, String queryFields,
			String queryCondition) throws ExportException {
		return DataExport.queryData(tableType, queryFields, queryCondition);
	}

	@Override
	public Long queryDataNumber(String tableType, String queryFields,
			String queryCondition) throws ExportException {
		return DataExport.queryDataNumber(tableType, queryFields, queryCondition);
	}

}
