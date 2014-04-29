package org.blade.whale.management.service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.dbutils.ResultSetHandler;
import org.blade.whale.model.UserActionVO;
import org.blade.whale.util.DBUtils;

public class ActionLog {

	public final static String INSERT_ACTION = "insert into user_action(username, useraction) values(\"";
	public final static String LIST_ACTION = "select username, useraction, action_timeStamp from user_action where username=\"";

	public static void insert(String username, String action)
			throws SQLException {
		String sql = INSERT_ACTION + username + "\", \""+ action +"\")";
		DBUtils.update(sql);
	}

	public static List<UserActionVO> listActions(String username,
			String fromDate, String toDate) throws SQLException {
		final List<UserActionVO> list = new ArrayList<UserActionVO>();
		String sql = LIST_ACTION + username + "\"";
		if (fromDate != null && !fromDate.equals("")) {
			sql += " and  action_timestamp > \"" + fromDate + "\"";
		}

		if (toDate != null && !toDate.equals("")) {
			sql += " and action_timestamp < \"" + toDate + "\"";
		}

		DBUtils.query(sql, new ResultSetHandler() {
			@Override
			public Object handle(ResultSet rs) throws SQLException {
				while (rs.next()) {
					String username = rs.getString(1);
					String action = rs.getString(2);
					String timeStamp = rs.getTimestamp(3).toString();
					list.add(new UserActionVO(username, action, timeStamp));
				}
				return null;
			}
		});

		return list;
	}
}
