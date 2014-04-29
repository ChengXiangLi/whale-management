package org.blade.whale.management.service;

import java.util.List;

import org.blade.whale.ExportException;

public interface DataExportService {
	public String exportData(String tableType, String exportFields,
			String exportCondition) throws ExportException;

	public List<List<String>> queryData(String tableType, String queryFields,
			String querytCondition) throws ExportException;
	
	public Long queryDataNumber(String tableType, String queryFields, String queryCondtion) throws ExportException;
}
