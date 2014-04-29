package org.blade.whale.dataimport;

import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.blade.whale.ImportException;
import org.blade.whale.meta.ColumnMeta;
import org.blade.whale.meta.MetaUtil;
import org.blade.whale.model.ColumnInfo;
import org.blade.whale.model.InsertInfo;
import org.blade.whale.model.TableType;

public class SheetScanner {

	private TableType tableType;
	private HSSFSheet sheet;
	private Map<String, ColumnMeta> mapping;
	private Map<Integer, String> fieldNames;

	public SheetScanner(TableType tableType, HSSFSheet sheet)
			throws ImportException {
		this.tableType = tableType;
		this.sheet = sheet;
		this.fieldNames = new HashMap<Integer, String>();
		checkTitle();
	}

	private void checkTitle() throws ImportException {
		int fieldNumber = this.sheet.getPhysicalNumberOfRows();
		if (fieldNumber > 0) {
			try {
				mapping = MetaUtil.getMetaInfo(this.tableType);
			} catch (SQLException e) {
				throw new ImportException("Failed to get mapping info.", e);
			}
			HSSFRow row = this.sheet.getRow(0);
			if (row.getLastCellNum() != row.getPhysicalNumberOfCells()) {
				throw new ImportException(
						"First row should be title, and there should not be any empty defined cell.");
			}
			int minCell = row.getFirstCellNum();
			int maxCell = row.getLastCellNum();
			for (int i = minCell; i <= maxCell; i++) {
				HSSFCell cell = row.getCell(i);
				if (cell == null) {
					continue;
				}
				String cellValue = cell.getStringCellValue();
				if (cellValue != null && !mapping.keySet().contains(cellValue)) {
					throw new ImportException(
							"The column["
									+ cellValue
									+ "] is not defined in DB, you can not import into DB.");
				}
				this.fieldNames.put(i, cellValue);
			}
		}
	}

	public RowIterator getRowIterator() {
		return new RowIterator();
	}

	public class RowIterator implements Iterator<InsertInfo> {

		private int index = 1;

		public boolean hasNext() {
			return index <= sheet.getLastRowNum();
		}

		public InsertInfo next() {
			HSSFRow row = sheet.getRow(index);
			List<ColumnInfo> columnInfos = new ArrayList<ColumnInfo>();
			int firstCell = row.getFirstCellNum();
			int lastCell = row.getLastCellNum();
			for (int i = firstCell; i <= lastCell; i++) {
				HSSFCell cell = row.getCell(i);
				String fieldName = fieldNames.get(i);
				if (fieldName == null) {
					continue;
				}
				ColumnMeta columnMeta = mapping.get(fieldName);
				ColumnInfo columnInfo = new ColumnInfo(
						columnMeta.getColumnName(), fieldName,
						columnMeta.getDataType(), getCellStringValue(cell,
								mapping.get(fieldNames.get(i)).getDataType()));
				columnInfos.add(columnInfo);
			}
			index++;
			return new InsertInfo(tableType, columnInfos);
		}

		public void remove() {
			throw new RuntimeException("RowIterator is readonly.");
		}

		private String getCellStringValue(HSSFCell cell, int fieldType) {
			if (cell == null) {
				return null;
			}
			String result = null;
			switch (cell.getCellType()) {
			case HSSFCell.CELL_TYPE_STRING:
				result = cell.getStringCellValue();
				break;
			case HSSFCell.CELL_TYPE_NUMERIC:
				if (fieldType == Types.INTEGER || fieldType == Types.BIGINT
						|| fieldType == Types.FLOAT
						|| fieldType == Types.DOUBLE
						|| fieldType == Types.TINYINT
						|| fieldType == Types.SMALLINT) {
					result = Double.toString(cell.getNumericCellValue());
				} else {
					Double doubleValue = cell.getNumericCellValue();
					result = Long.toString(doubleValue.longValue());
				}
				break;
			case HSSFCell.CELL_TYPE_BOOLEAN:
				result = Boolean.toString(cell.getBooleanCellValue());
				break;
			case HSSFCell.CELL_TYPE_BLANK:
				result = "";
				break;
			default:
				break;
			}
			return result;
		}
	}
}
