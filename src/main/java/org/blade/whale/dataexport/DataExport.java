package org.blade.whale.dataexport;

import static com.google.common.base.Preconditions.checkNotNull;

import java.io.File;
import java.io.FileOutputStream;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;

import org.apache.commons.dbutils.ResultSetHandler;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.blade.whale.ExportException;
import org.blade.whale.meta.ColumnMeta;
import org.blade.whale.meta.MetaUtil;
import org.blade.whale.model.TableType;
import org.blade.whale.util.DBUtils;
import org.blade.whale.util.PathUtil;

public class DataExport {
	private final static String EXPORT_BASE_PATH = "export";

	public static String exportData(String tableType, String exportFields,
			String exportCondition) throws ExportException {
		preCheck(exportFields);
		String queryString = getQuerySQL(tableType, exportFields,
				exportCondition);
		return exportData(tableType, queryString);
	}

	private static String getQuerySQL(String tableType, String exportFields,
			String queryCondition) {
		String queryString = "select " + exportFields + " from " + tableType;
		if (queryCondition != null && !queryCondition.isEmpty()) {
			queryString += " where " + queryCondition;
		}

		queryString += " limit 100";
		return queryString;
	}

	private static String getQueryNumberSQL(String tableType,
			String exportFields, String queryCondition) {
		String queryString = "select count(*) from " + tableType;
		if (queryCondition != null && !queryCondition.isEmpty()) {
			queryString += " where " + queryCondition;
		}
		return queryString;
	}

	public static List<List<String>> queryData(String tableType,
			String queryFields, String queryCondition) throws ExportException {
		checkNotNull(queryFields, "query sql can not be null.");
		String querySql = getQuerySQL(tableType, queryFields, queryCondition);
		return internalQuery(querySql);
	}

	public static Long queryDataNumber(String tableType, String queryFields,
			String queryCondition) throws ExportException {
		String querySql = getQueryNumberSQL(tableType, queryFields,
				queryCondition);
		ResultSetHandler rst = new ResultSetHandler() {
			@Override
			public Object handle(ResultSet rs) throws SQLException {
				rs.next();
				return rs.getLong(1);
			}
		};

		try {
			Long resultNumber = (Long) DBUtils.query(querySql, rst);
			return resultNumber;
		} catch (SQLException e) {
			throw new ExportException("Failed to query sql[" + querySql + "].",
					e);
		}
	}

	private static List<List<String>> internalQuery(String querySql)
			throws ExportException {
		final List<List<String>> resultList = new ArrayList<List<String>>();
		ResultSetHandler rst = new ResultSetHandler() {
			public Object handle(ResultSet rs) throws SQLException {
				// // get fields name.
				// List<String> fieldNames = new ArrayList<String>();
				ResultSetMetaData rsm = rs.getMetaData();
				int columnCount = rsm.getColumnCount();
				// for (int i = 0; i < columnCount; i++) {
				// fieldNames.add(rsm.getColumnName(i+1));
				// }
				// resultList.add(fieldNames);

				while (rs.next()) {
					List<String> columnValues = new ArrayList<String>();
					for (int i = 0; i < columnCount; i++) {
						String columnValue = rs.getString(i + 1);
						if (columnValue == null) {
							columnValue = "";
						}
						columnValues.add(columnValue);
					}
					resultList.add(columnValues);
				}
				return null;
			}
		};
		try {
			DBUtils.query(querySql, rst);
		} catch (SQLException e) {
			throw new ExportException("Failed to query sql[" + querySql + "].",
					e);
		}
		return resultList;
	}

	public static String exportData(String tableType, String queryString)
			throws ExportException {
		preCheck(queryString);
		return internalExport(TableType.valueOf(tableType), queryString);
	}

	private static void preCheck(String querySql) throws ExportException {
		checkNotNull(querySql, "query sql can not be null.");
	}

	private static String internalExport(final TableType tableType,
			String queryString) throws ExportException {
		final HSSFWorkbook excel = new HSSFWorkbook();
		final HSSFSheet sheet = excel.createSheet();
		ResultSetHandler rst = new ResultSetHandler() {
			public Object handle(ResultSet rs) throws SQLException {
				ResultSetMetaData metadata = rs.getMetaData();
				HSSFRow metaRow = sheet.createRow(0);
				int columnCount = metadata.getColumnCount();
				for (int i = 0; i < columnCount; i++) {
					HSSFCell metaCell = metaRow.createCell(i);
					String columnName = metadata.getColumnName(i + 1);
					metaCell.setCellValue(getFieldName(columnName));
				}
				int index = 1;
				while (rs.next()) {
					HSSFRow row = sheet.createRow(index);
					for (int i = 0; i < columnCount; i++) {
						HSSFCell cell = row.createCell(i);
						cell.setCellValue(rs.getString(i + 1));
					}
					index++;
				}
				return null;
			}

			private String getFieldName(String columnName) throws SQLException {
				Map<String, ColumnMeta> columnMetas = MetaUtil
						.getMetaInfo(tableType);
				for (Entry<String, ColumnMeta> entry : columnMetas.entrySet()) {
					String fieldName = entry.getKey();
					if (entry.getValue().getColumnName().equals(columnName)) {
						return fieldName;
					}
				}
				return null;
			}
		};

		String fileName = UUID.randomUUID().toString() + ".xls";
		try {
			DBUtils.query(queryString, rst);
			String parentPath = PathUtil.getWebInfPath() + File.separator
					+ EXPORT_BASE_PATH + File.separator + tableType.toString();
			File parent = new File(parentPath);
			if (!parent.exists()) {
				parent.mkdirs();
			}
			FileOutputStream outputStream = new FileOutputStream(new File(
					parentPath, fileName));
			excel.write(outputStream);
		} catch (Exception e) {
			throw new ExportException("Failed to export with sql["
					+ queryString + "].", e);
		}
		return fileName;
	}
}
