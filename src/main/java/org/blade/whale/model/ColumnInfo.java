package org.blade.whale.model;

import java.sql.Types;
import java.util.Date;

import org.blade.whale.ImportException;
import org.blade.whale.meta.MetaUtil;

public class ColumnInfo {

	// column name in db.
	private String columnName;

	private int dataType;

	// field name in excel.
	private String fieldName;

	private String fieldValue;

	public ColumnInfo(String columnName, String fieldName, int type,
			String fieldValue) {
		this.columnName = columnName;
		this.fieldName = fieldName;
		this.dataType = type;
		this.fieldValue = fieldValue;
//		if (dataType == Types.BIGINT) {
//			Double doubleValue = Double.parseDouble(fieldValue);
//			this.fieldValue = Long.toString(doubleValue.longValue());
//		} else if (dataType == Types.INTEGER) {
//			Double doubleValue = Double.parseDouble(fieldValue);
//			this.fieldValue = Integer.toString(doubleValue.intValue());
//		} else {
//			this.fieldValue = fieldValue.toString();
//		}
	}

	public ColumnInfo(ColumnInfo columnInfo) {
		this.columnName = columnInfo.getColumnName();
		this.fieldName = columnInfo.getFieldName();
		this.dataType = columnInfo.getDataType();
		this.fieldValue = columnInfo.getFieldValue();
	}

	public String getColumnName() {
		return columnName;
	}

	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}

	public String getFieldName() {
		return fieldName;
	}

	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	public int getDataType() {
		return dataType;
	}

	public void setDateType(int dataType) {
		this.dataType = dataType;
	}

	public String getFieldValue() {
		return fieldValue;
	}

	public void setFieldValue(String fieldValue) {
		this.fieldValue = fieldValue;
	}

	public Object getValue() throws ImportException {
		if (this.fieldValue == null) {
			return null;
		}
		Object result = null;
		if (this.fieldName.equalsIgnoreCase("子女就读年级")) {
			result = StudentGrade.parse(fieldValue).getIntValue();
		} else {
			switch (dataType) {
			case Types.INTEGER:
				result = Integer.parseInt(fieldValue);
				break;
			case Types.BIGINT:
				result = Long.parseLong(fieldValue);
				break;
			case Types.FLOAT:
				result = Float.parseFloat(fieldValue);
				break;
			case Types.DOUBLE:
				result = Double.parseDouble(fieldValue);
			case Types.VARCHAR:
				result = fieldValue;
				break;
			case Types.DATE:
				result = MetaUtil.parseDate(fieldValue);
				break;
			case Types.TIMESTAMP:
				result = MetaUtil.parseDate(fieldValue);
				break;
			default:
				throw new ImportException("We do not support dataType["
						+ dataType + "] now.");
			}
		}
		return result;
	}
}
