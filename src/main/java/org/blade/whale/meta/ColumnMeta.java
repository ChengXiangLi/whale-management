package org.blade.whale.meta;

public class ColumnMeta {
	private String columnName;
	private int dataType;
	
	public ColumnMeta(String columnName, int dataType) {
		this.columnName = columnName;
		this.dataType = dataType;
	}
	
	public String getColumnName() {
		return columnName;
	}

	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}

	public int getDataType() {
		return dataType;
	}

	public void setDataType(int dataType) {
		this.dataType = dataType;
	}
}
