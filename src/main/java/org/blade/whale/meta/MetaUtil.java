package org.blade.whale.meta;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.dbutils.ResultSetHandler;
import org.blade.whale.ImportException;
import org.blade.whale.model.TableType;
import org.blade.whale.util.DBUtils;

public class MetaUtil {

	public static Map<String, ColumnMeta> getMetaInfo(TableType tableName)
			throws SQLException {
		final Map<String, ColumnMeta> columnMetas = new HashMap<String, ColumnMeta>();

		String sql2 = "select * from " + tableName.toString().toUpperCase()
				+ " limit 1";
		ResultSetHandler rsh2 = new ResultSetHandler() {
			public Object handle(ResultSet rs) throws SQLException {
				ResultSetMetaData metas = rs.getMetaData();
				int columnCount = metas.getColumnCount();
				for (int i = 1; i <= columnCount; i++) {
					String columnName = metas.getColumnName(i);
					int columnType = metas.getColumnType(i);
					columnMetas.put(columnName, new ColumnMeta(columnName,
							columnType));
				}
				return null;
			}
		};

		DBUtils.query(sql2, rsh2);

		return columnMetas;
	}

	public static Date parseDate(String input) throws ImportException {
		SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-dd-MM");
		SimpleDateFormat sdf3 = new SimpleDateFormat("yyyy/MM/dd");
		SimpleDateFormat sdf4 = new SimpleDateFormat("yyyy/dd/MM");
		SimpleDateFormat sdf5 = new SimpleDateFormat("yyyy年MM月dd日");
		SimpleDateFormat sdf6 = new SimpleDateFormat("yyyy年MM月");
		SimpleDateFormat sdf7 = new SimpleDateFormat("yyyyMMdd");

		Date result = null;
		try {
			result = Date.valueOf(input);
			return result;
		} catch (IllegalArgumentException e) {
		}

		java.util.Date date = null;
		try {
			date = sdf1.parse(input);
		} catch (ParseException e1) {
			try {
				date = sdf2.parse(input);
			} catch (ParseException e2) {
				try {
					date = sdf3.parse(input);
				} catch (ParseException e3) {
					try {
						date = sdf4.parse(input);
					} catch (ParseException e4) {
						try {
							date = sdf5.parse(input);
						} catch (ParseException e) {
							try {
								date = sdf6.parse(input);
							} catch (ParseException e5) {
								try {
									date = sdf7.parse(input);
								} catch (ParseException e6) {
									throw new ImportException("Failed to parse input["
											+ input + "] to Date.");
								}
							}
						}
					}
				}
			}
		}
		result = new Date(date.getTime());
		return result;
	}
}
