package org.blade.whale.management.service;

import org.blade.whale.management.service.impl.DataExportServiceImpl;
import org.blade.whale.management.service.impl.DataImportServiceImpl;
import org.blade.whale.management.service.impl.UserServiceImpl;

public class ServiceFactory {
	private static DataImportService importService = new DataImportServiceImpl();
	private static DataExportService exportService = new DataExportServiceImpl();
	private static UserService userService = new UserServiceImpl();

	public static DataImportService getDataImportService() {
		return importService;
	}
	
	public static DataExportService getDataExportService() {
		return exportService;
	}
	
	public static UserService getUserService() {
		return userService;
	}
}
