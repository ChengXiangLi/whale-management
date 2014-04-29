package org.blade.whale.dataimport;

import java.io.File;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.blade.whale.ImportException;
import org.blade.whale.model.ColumnInfo;
import org.blade.whale.model.InsertInfo;
import org.blade.whale.model.TableType;
import org.blade.whale.util.DBUtils;
import org.blade.whale.util.PathUtil;

public class DataImport {
	public final static  String IMPORT_FILE_BASE_PATH = "import";
	
	public static void dataImport(String fileName, String tableName)
			throws ImportException {
		TableType tableType = TableType.valueOf(tableName);
		String importPath = PathUtil.getWebInfPath() + File.separator + IMPORT_FILE_BASE_PATH + File.separator + tableName + File.separator + fileName;
		ExcelScanner excelScanner = new ExcelScanner(tableType, importPath);
		try {
			internalImport(excelScanner);
		} catch (SQLException e) {
			throw new ImportException("Failed to insert data into db.", e);
		}
		File file = new File(importPath);
		if (file.exists()) {
			file.delete();
		}
	}
	
	public static void deleteFile(String fileName, String tableName) throws ImportException {
		String importPath = PathUtil.getWebInfPath() + File.separator + IMPORT_FILE_BASE_PATH + File.separator + tableName + File.separator + fileName;
		File file = new File(importPath);
		if (file.exists() && file.isFile()) {
			file.delete();
		}
	}

	private static void internalImport(ExcelScanner excelScanner)
			throws ImportException, SQLException {
		List<SheetScanner> sheetScanners = excelScanner.getSheetScanners();
		for (SheetScanner sheetScanner : sheetScanners) {
			insert(sheetScanner);
		}
	}

	private static void insert(SheetScanner sheetScanner) throws SQLException,
			ImportException {
		Iterator<InsertInfo> iterator = sheetScanner.getRowIterator();
		String sql = null;
		List<Object[]> parameters = new ArrayList<Object[]>();
		if (iterator.hasNext()) {
			InsertInfo first = iterator.next();
			sql = getSql(first);
			parameters.add(getParameters(first));
		}

		while (iterator.hasNext()) {
			InsertInfo insertInfo = iterator.next();
			parameters.add(getParameters(insertInfo));
		}

		if (parameters.size() == 0) {
			return;
		}

		Object[][] params = new Object[parameters.size()][];
		for (int i = 0; i < parameters.size(); i++) {
			params[i] = parameters.get(i);
		}
		DBUtils.batch(sql, params);
	}

	private static String getSql(InsertInfo insertInfo) {
		StringBuilder sb = new StringBuilder();
		sb.append("insert into ").append(insertInfo.getTableType().toString())
				.append(" (");
		List<ColumnInfo> columnInfos = insertInfo.getColumnInfos();
		boolean first = true;
		for (ColumnInfo columnInfo : columnInfos) {
			if (!first) {
				sb.append(", ");
			}
			sb.append(columnInfo.getColumnName());
			first = false;
		}
		sb.append(") values(");
		first = true;
		for (int i = 0; i < columnInfos.size(); i++) {
			if (!first) {
				sb.append(", ");
			}
			sb.append("?");
			first = false;
		}
		sb.append(")");
		return sb.toString();
	}

	private static Object[] getParameters(InsertInfo insertInfo)
			throws ImportException {
		List<ColumnInfo> columnInfos = insertInfo.getColumnInfos();
		int length = columnInfos.size();
		Object[] parameter = new Object[length];
		int i = 0;
		for (ColumnInfo ci : columnInfos) {
			parameter[i] = ci.getValue();
			i++;
		}

		return parameter;
	}
}
