package org.blade.whale.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

import org.apache.commons.dbcp.BasicDataSource;
import org.apache.commons.dbutils.QueryRunner;
import org.apache.commons.dbutils.ResultSetHandler;
import org.blade.whale.Configuration;

public class DBUtils {

	private final static String DRIVER_NAME = "com.mysql.jdbc.Driver";
	private final static String url = Configuration.getDBUrl();
	private final static String mysql = Configuration.getMysqlUrl();
	private final static String username = Configuration.getDBUsername();
	private final static String password = Configuration.getDBPassword();
	private static QueryRunner queryRunner = null;

	public static void batch(String sql, Object[][] parameters)
			throws SQLException {
		QueryRunner queryRunner = getQueryRunner();
		queryRunner.batch(sql, parameters);
	}

	public static void update(String sql) throws SQLException {
		getQueryRunner().update(sql);
	}

	public static Object query(String sql, ResultSetHandler resultHandler)
			throws SQLException {
		return getQueryRunner().query(sql, resultHandler);
	}

	public static void executeSqlScript(String fileName) throws IOException,
			SQLException {
		// 建立数据库连接
		try {
			Class.forName(DRIVER_NAME);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
		Connection conn = (Connection) DriverManager.getConnection(mysql,
				username, password);
		Statement stmt = conn.createStatement();
		// 读取文件
		InputStream r = Thread.currentThread().getContextClassLoader()
				.getResourceAsStream("init.sql");
		ByteArrayOutputStream byteout = new ByteArrayOutputStream();
		byte tmp[] = new byte[256];
		byte context[];
		int i = 0;
		while ((i = r.read(tmp)) != -1) {
			byteout.write(tmp, 0, i);
		}
		context = byteout.toByteArray();
		String str = new String(context, "UTF-8");
		// 分隔行
		String stra[] = str.split(";");
		for (int n = 0; n < stra.length; n++) {
			// System.out.println(stra[n]);
			stmt.addBatch(stra[n]);
		}
		stmt.executeBatch();
	}

	private static QueryRunner getQueryRunner() {
		if (queryRunner == null) {
			BasicDataSource dataSource = new BasicDataSource();
			dataSource.setDriverClassName(DRIVER_NAME);
			dataSource.setUrl(url);
			dataSource.setUsername(username);
			dataSource.setPassword(password);
			queryRunner = new QueryRunner(dataSource);
		}
		return queryRunner;
	}
}
