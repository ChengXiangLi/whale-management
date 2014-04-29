package org.blade.whale.service.impl;

import java.sql.SQLException;
import java.util.List;

import org.blade.whale.management.service.ActionLog;
import org.blade.whale.model.UserActionVO;
import org.junit.Test;

public class ActionLogTest {
	@Test
	public void test1() throws SQLException {
		ActionLog.insert("admin", "insert sql action");
		List<UserActionVO> list = ActionLog.listActions("admin", "2013-07-28 11:17:18", "2013-07-28 11:17:50");
		for (UserActionVO action : list) {
			System.out.println(action);
		}
	}
}
