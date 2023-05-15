<template>
    <div class="management">
        <div
            style="
                padding: 16px 16px;
                border-bottom: 1px solid #ebebeb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
            <div></div>
            <el-radio-group
                v-model="noticeStates"
                @input="
                    () => {
                        getCreateProjectList()
                        tableDataPage = 0
                        tableDataSize = 10
                    }
                ">
                <el-radio :label="1">待抽取</el-radio>
                <el-radio :label="2">开始抽取</el-radio>
                <el-radio :label="3">未结束</el-radio>
                <el-radio :label="4">通知结束</el-radio>
                <el-radio :label="5">已评价</el-radio>
                <el-radio :label="6">流标</el-radio>
            </el-radio-group>
        </div>
        <div style="display: flex; justify-content: center; padding: 16px; gap: 60px">
            <div style="display: flex; align-items: center; width: 38%">
                <span style="font-size: 14px; color: #5c5c5c; white-space: nowrap"
                    >标段(包)编号：
                </span>
                <el-input v-model="inputCode" size="small" style="max-width: 250px"></el-input>
            </div>
            <div style="display: flex; align-items: center; width: 38%">
                <span style="font-size: 14px; color: #5c5c5c; white-space: nowrap"
                    >标段(包)名称：
                </span>
                <el-input v-model="inputName" size="small"></el-input>
            </div>
            <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                style="padding: 0 8px"
                @click="
                    () => {
                        getCreateProjectList()
                        tableDataPage = 0
                        tableDataSize = 10
                    }
                "
                >搜索</el-button
            >
        </div>
        <!-- 列表内容 ======================================= -->
        <div
            style="
                width: calc(100vw - 181px);
                height: calc(100% - 160px);
                position: relative;
                padding: 8px 12px;
                box-sizing: border-box;
            ">
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                :header-cell-style="{ background: '#FAFAFA' }"
                size="small"
                width="100%"
                height="100%"
                style="width: 100%">
                <template slot="empty">
                    <img style="margin-top: 72px" src="@/assets/images/nodata.png" alt="" />
                    <p>没有数据</p>
                </template>
                <el-table-column label="序" width="56">
                    <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="xmid" label="标段(包)编号" width="220"> </el-table-column>
                <el-table-column prop="xmname" label="标段(包)名称" width="160"> </el-table-column>
                <el-table-column prop="xm_dq" label="项目地区"> </el-table-column>
                <el-table-column prop="xm_dq" label="评标地点"> </el-table-column>
                <el-table-column prop="xm_pb_time" label="评标时间"> </el-table-column>
                <el-table-column prop="name" label="项目状态">
                    <template slot-scope="scope"> 未抽取 </template>
                </el-table-column>
                <el-table-column prop="name" label="操作">
                    <template slot-scope="scope">
                        <i
                            class="el-icon-edit"
                            style="color: #2590eb; cursor: pointer"
                            @click="selectionsDialogFormVisible(scope.row)"></i>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div
            style="
                height: 50px;
                background-color: #fff;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                position: fixed;
                right: 0;
                bottom: 0;
            ">
            <el-pagination
                background
                layout="prev, pager, sizes, jumper, total"
                :page-size="this.tableDataSize"
                :total="tableDataTotal"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
            </el-pagination>
        </div>
        <!-- 抽取弹窗 -->
        <el-dialog class="extract-object" title="抽取弹窗" :visible.sync="dialogFormVisible">
            <div style="width: 100%; height: 100%; display: flex">
                <div
                    style="
                        position: relative;
                        width: 230px;
                        height: 100%;
                        float: left;
                        background-color: #f7f7f7;
                    ">
                    <div class="flow-info">
                        <div
                            class="finish"
                            :class="{ 'is-active': formLabelAlign.noticestates >= 1 }">
                            <div class="finish-item">
                                <img src="@/assets/images/icon-ac-1.png" alt="" />
                            </div>
                            项目信息
                            <img
                                class="arrow-bottom"
                                src="@/assets/images/arrow-bottom.png"
                                alt="" />
                        </div>
                        <div
                            class="finish"
                            :class="{ 'is-active': formLabelAlign.noticestates >= 2 }"
                            @click="
                                () => {
                                    if (formLabelAlign.noticestates >= 2) {
                                        dangqianClick = 2
                                    }
                                }
                            ">
                            <div class="finish-item">
                                <img
                                    v-if="formLabelAlign.noticestates >= 2"
                                    src="@/assets/images/icon-ac-1.png"
                                    alt="" />
                                <img v-else src="@/assets/images/icon-ac-1-1.png" alt="" />
                            </div>
                            抽取评委
                            <img
                                class="arrow-bottom"
                                src="@/assets/images/arrow-bottom.png"
                                alt="" />
                        </div>
                        <div
                            class="finish"
                            :class="{ 'is-active-tz': formLabelAlign.noticestates >= 3 }"
                            @click="
                                () => {
                                    if (formLabelAlign.noticestates >= 3) {
                                        dangqianClick = 3
                                    }
                                }
                            ">
                            <div class="finish-item">
                                <img
                                    v-if="formLabelAlign.noticestates >= 3"
                                    src="@/assets/images/icon-now3.png"
                                    alt="" />
                                <img v-else src="@/assets/images/icon3.png" alt="" />
                            </div>
                            通知评委
                            <img
                                class="arrow-bottom"
                                src="@/assets/images/arrow-bottom.png"
                                alt="" />
                        </div>
                        <div
                            class="finish"
                            :class="{ 'is-active': formLabelAlign.noticestates >= 4 }">
                            <div class="finish-item">
                                <img src="@/assets/images/icon4.png" alt="" />
                            </div>
                            评委名单
                            <img
                                class="arrow-bottom"
                                src="@/assets/images/arrow-bottom.png"
                                alt="" />
                        </div>
                    </div>
                </div>

                <div
                    v-if="dangqianClick == 2"
                    style="flex: 1; display: flex; flex-direction: column">
                    <div
                        style="
                            border-bottom: 1px solid #f0f2f5;
                            padding: 10px;
                            display: flex;
                            justify-content: space-between;
                        ">
                        <el-button type="primary" size="small" @click="chouquPop = true"
                            >抽取</el-button
                        >
                        <el-dialog
                            class="tipsPop"
                            width="30%"
                            title="提示"
                            :visible.sync="chouquPop"
                            append-to-body>
                            <p>抽取成功!</p>
                            <div style="margin-top: 10px; display: flex; justify-content: flex-end">
                                <el-button
                                    type="primary"
                                    size="small"
                                    @click="
                                        () => {
                                            chouquUpdata()
                                            chouquPop = false
                                        }
                                    "
                                    >确定</el-button
                                >
                            </div>
                        </el-dialog>
                        <div>
                            <span>下一步：</span>
                            <el-button size="small">通知评委</el-button>
                        </div>
                    </div>
                    <div style="padding: 20px; overflow: auto">
                        <el-collapse v-model="activeNames">
                            <el-collapse-item name="1">
                                <template slot="title">
                                    <p style="color: #2590eb">
                                        01 抽取概况 (状态：{{
                                            formLabelAlign.noticestates == 1 ? '未抽取' : '已抽取'
                                        }})
                                    </p>
                                </template>
                                <el-table
                                    :data="yixuanzhuanye"
                                    tooltip-effect="dark"
                                    :header-cell-style="{ background: '#FAFAFA' }"
                                    size="small"
                                    style="width: 100%">
                                    <template slot="empty">
                                        <img
                                            style="margin-top: 40px"
                                            src="@/assets/images/nodata.png"
                                            alt="" />
                                        <p>没有数据</p>
                                    </template>
                                    <el-table-column label="序" width="56">
                                        <template slot-scope="scope">{{
                                            scope.$index + 1
                                        }}</template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="评标专业" width="200">
                                    </el-table-column>
                                    <el-table-column prop="name" label="抽取类别">
                                        <template slot-scope="scope">本地抽取</template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="抽取设置">
                                        <template slot-scope="scope">--</template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="满足条件人数" width="120">
                                        <template slot-scope="scope">8</template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="所需人数">
                                        <template slot-scope="scope">0</template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="需抽人数">
                                        <template slot-scope="scope">0</template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="已抽人数">
                                        <template slot-scope="scope">0</template>
                                    </el-table-column>
                                </el-table>
                            </el-collapse-item>
                            <el-collapse-item name="2">
                                <template slot="title">
                                    <p style="color: #2590eb">02 评委抽取</p>
                                </template>
                                <el-table
                                    :data="pingweiList"
                                    tooltip-effect="dark"
                                    :header-cell-style="{ background: '#FAFAFA' }"
                                    size="small"
                                    style="width: 100%">
                                    <template slot="empty">
                                        <img
                                            style="margin-top: 40px"
                                            src="@/assets/images/nodata.png"
                                            alt="" />
                                        <p>没有数据</p>
                                    </template>
                                    <el-table-column label="序" width="56">
                                        <template slot-scope="scope">{{
                                            scope.$index + 1
                                        }}</template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="姓名"> </el-table-column>
                                    <el-table-column prop="name" label="评委编号">
                                        <template slot-scope="scope">XXX</template>
                                    </el-table-column>
                                    <el-table-column prop="job_phone" label="电话">
                                    </el-table-column>
                                    <el-table-column prop="zhuan_ye" label="评标专业" width="220">
                                    </el-table-column>
                                    <el-table-column prop="name" label="抽取日期" width="180">
                                        <template slot-scope="scope">2023-03-15 12:49:13</template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="通知状态">
                                        <template slot-scope="scope">
                                            <span style="color: blue">可以参加</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>
                <div
                    v-else-if="dangqianClick == 3"
                    style="flex: 1; display: flex; flex-direction: column">
                    <div
                        style="
                            border-bottom: 1px solid #f0f2f5;
                            padding: 10px;
                            display: flex;
                            justify-content: space-between;
                        ">
                        <div>
                            <el-button type="primary" size="small">开始通知</el-button>
                            <el-button size="small" plain>暂停通知</el-button>
                            <el-button size="small" plain>转手动通知</el-button>
                            <el-button size="small" plain>发送短信</el-button>
                        </div>
                        <div></div>
                    </div>
                    <div style="padding: 20px; overflow: auto">
                        <el-collapse v-model="activeNames">
                            <el-collapse-item name="1">
                                <template slot="title">
                                    <p style="color: #2590eb">
                                        01 抽取概况 (状态：{{
                                            formLabelAlign.noticestates == 1 ? '未抽取' : '已抽取'
                                        }})
                                    </p>
                                </template>
                                <p style="font-size: 14px; color: #6e622e; margin-top: 20px">
                                    专家通知情况:已通知
                                    <span style="color: #ff0000">2</span> 位;尚未通知
                                    <span style="color: #ff0000">6</span> 位;已确认参加
                                    <span style="color: #ff0000">1</span> 位
                                </p>
                            </el-collapse-item>
                            <el-collapse-item name="2">
                                <template slot="title">
                                    <p style="color: #2590eb">02 评委抽取</p>
                                </template>
                                <el-table
                                    :data="pingweiList"
                                    tooltip-effect="dark"
                                    :header-cell-style="{ background: '#FAFAFA' }"
                                    size="small"
                                    style="width: 100%">
                                    <template slot="empty">
                                        <img
                                            style="margin-top: 40px"
                                            src="@/assets/images/nodata.png"
                                            alt="" />
                                        <p>没有数据</p>
                                    </template>
                                    <el-table-column label="序" width="56">
                                        <template slot-scope="scope">{{
                                            scope.$index + 1
                                        }}</template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="姓名"> </el-table-column>
                                    <el-table-column prop="name" label="评委编号">
                                        <template slot-scope="scope">XXX</template>
                                    </el-table-column>
                                    <el-table-column prop="job_phone" label="电话">
                                    </el-table-column>
                                    <el-table-column prop="zhuan_ye" label="评标专业" width="220">
                                    </el-table-column>
                                    <el-table-column prop="name" label="抽取日期" width="180">
                                        <template slot-scope="scope">2023-03-15 12:49:13</template>
                                    </el-table-column>
                                    <el-table-column prop="name" label="通知状态">
                                        <template slot-scope="scope">
                                            <span style="color: blue">可以参加</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
    createProjectAdd,
    createProjectList,
    danweiList,
    zhuanyeAdd,
    createProjectUpdate,
    zhuanyeGetlist,
    zhuanyeDelete,
    zhaobiaorenpingweiAdd,
    zhaobiaorenpingweiGetlist,
    zhaobiaorenpingweiDeleteList
} from '@/api/index.js'

export default {
    name: 'management',
    components: {},
    data() {
        return {
            chouquPop: false,
            activeNames: ['1', '2', '3', '4', '5', '6', '7'],
            dangqianClick: 2,
            // 列表筛选 ======================>
            tableData: [], // 列表
            tableDataTotal: 0,
            tableDataPage: 0,
            tableDataSize: 10,
            inputCode: '', // 搜索代码
            inputName: '', // 搜索名字
            noticeStates: 1, // 筛选状态
            // 主要内容 ======================>
            dialogFormVisible: false, // 新增弹窗
            activeName: '1', // 必填信息tab切换
            tipsPop: false, // 提示信息
            formLabelAlign: {
                createstates: 0,
                xmid: '',
                xmname: '',
                xm_zbr: '',
                xm_dljg: '',
                xm_pbhs: 1,
                xm_pbdd_id: '',
                xm_pb_time_day: new Date(),
                xm_pb_time_h: '14',
                xm_pb_time_d: '30',
                xm_pb_time: '1998-02-02 22:31:53',
                xm_pwqd_time_day: new Date(),
                xm_pwqd_time_h: '14',
                xm_pwqd_time_d: '30',
                xm_pwqd_time: '1989-01-22 22:07:25',
                day_1: '8',
                day_2: '7',
                xm_dq: '和田地区'
            },
            createstatese1Pop: false, // 意见弹窗
            chulichenggongPop: false, // 处理成功
            // 选择项目 =======================>
            slaketTableData: [], // 选择内容
            xuanzexiangmuPop: false, // 大弹窗
            xuanzexiangmuPopYes: false, // 不可更改
            radiowaicheng: '', // 选择项目选择框
            thisRow: {}, // 内容暂存
            // 选择单位===============
            radio: '',
            zhaobiaorenPop: false, // 选择项目
            zhaobiaorenPopList: [], // 单位列表
            zhaobiaorenIsOne: 1, // 判断是否是招标人
            danweiZancun: '', // 选择单位暂存
            // 设置专业信息============
            zhuanyexinxiPop: false, // 专业信息弹窗
            yixuanzhuanye: [], // 已选专业
            yixuanzhuanyeThis: [], // 当前已选专业
            yixuanzhuanyeDetail: [], // 要删除的列表
            qierenshanchu: false, // 确认专业
            // 新增评委 ================
            pingweiList: [], // 评委列表
            addPingwei: false, // 新增评委弹窗
            addPingweiFrom: {
                sex: '',
                age: '',
                xueli: '',
                idCode: '',
                job: '',
                pw_type: '',
                pw_job: '',
                phone: '',
                job_name: '',
                job_address: '',
                job_phone: '',
                zhuan_ye: '',
                zhi_ye_id: '',
                comname: '',
                comtype: '',
                comaddress: ''
            }, // 新增评委内容
            xuanZhongpingwei: [],
            activeNamesPingwei: ['1', '2']
        }
    },
    mounted() {
        this.getCreateProjectList()
        this.getCreateProjectLLLL()
    },
    methods: {
        selectionsDialogFormVisible(row) {
            this.dialogFormVisible = true
            this.formLabelAlign = row
            this.getZhuanyeList()
            this.pingweiPopOpen()
        },
        async getCreateProjectList() {
            // 获取列表
            const res = await createProjectList({
                page: this.tableDataPage,
                size: this.tableDataSize,
                id: this.inputCode,
                name: this.inputName,
                create_states: 0,
                notice_states: this.noticeStates
            })
            this.tableData = res.data.result.data || []
            this.tableDataTotal = res.data.result.total
        },
        async getCreateProjectLLLL() {
            // 获取列表
            const res = await createProjectList({
                page: 0,
                size: 10000,
                create_states: 0
            })
            this.slaketTableData = res.data.result.data || []
        },
        async chouquUpdata() {
            this.formLabelAlign.noticestates = 3
            await createProjectUpdate(this.formLabelAlign)
            this.getCreateProjectList()
        },
        async addProject(createstatese = 1, tips = true) {
            // 点击新增， tips静默提交
            if (this.formLabelAlign.xmid === '') {
                this.$message.error('标段(包)编号 验证失败：标段(包)编号 必须填写')
                return
            }
            if (this.formLabelAlign.xmname === '') {
                this.$message.error('标段(包)名称 验证失败：标段(包)名称 必须填写')
                return
            }
            if (this.formLabelAlign.xm_pbhs === '') {
                this.$message.error('评标耗时 验证失败：评标耗时 必须填写')
                return
            }
            if (this.formLabelAlign.xm_pbdd_id === '') {
                this.$message.error('评标地点 验证失败：评标地点 必须填写')
                return
            }
            if (this.formLabelAlign.id) {
                // 有id则表示更新
                await createProjectUpdate(this.formLabelAlign)
            } else {
                let timetip =
                    this.formLabelAlign.xm_pb_time_day.setHours(0, 0, 0, 0) +
                    this.formLabelAlign.xm_pb_time_h * 60 * 60 * 1000 +
                    this.formLabelAlign.xm_pb_time_d * 60 * 1000
                let timetip2 =
                    this.formLabelAlign.xm_pwqd_time_day.setHours(0, 0, 0, 0) +
                    this.formLabelAlign.xm_pwqd_time_h * 60 * 60 * 1000 +
                    this.formLabelAlign.xm_pwqd_time_d * 60 * 1000
                this.formLabelAlign.xm_pb_time = this.timeConversion(timetip)
                this.formLabelAlign.xm_pwqd_time = this.timeConversion(timetip2)
                this.formLabelAlign.createstates = createstatese
                const res = await createProjectAdd(this.formLabelAlign)
                this.formLabelAlign.id = res.data.result.id
            }
            if (createstatese == 2) {
                this.createstatese1Pop = true
            }
            if (createstatese == 1 && tips) {
                this.tipsPop = true
            }
        },
        timeConversion(timp) {
            //日期
            let today = new Date(timp)
            var DD = String(today.getDate()).padStart(2, '0') // 获取日
            var MM = String(today.getMonth() + 1).padStart(2, '0') //获取月份，1 月为 0
            var yyyy = today.getFullYear() // 获取年
            // 时间
            var hh = String(today.getHours()).padStart(2, '0') //获取当前小时数(0-23)
            var mm = String(today.getMinutes()).padStart(2, '0') //获取当前分钟数(0-59)
            var ss = String(today.getSeconds()).padStart(2, '0') //获取当前秒数(0-59)
            return yyyy + '-' + MM + '-' + DD + ' ' + hh + ':' + mm + ':' + ss
        },
        selectItem(row) {
            // 大弹窗点击加号添加
            this.formLabelAlign.xmid = row.xmid
            this.formLabelAlign.xmname = row.xmname
            this.formLabelAlign.xm_zbr = row.xm_zbr
            this.formLabelAlign.xm_dljg = row.xm_dljg
            this.formLabelAlign.xm_pbdd_id = row.xm_pbdd_id
            this.xuanzexiangmuPop = false
            this.xuanzexiangmuPopYes = true
        },
        dialogFormVisibleHandleClose() {
            // 关闭新增弹窗
            this.formLabelAlign = {
                createstates: 0,
                xmid: '',
                xmname: '',
                xm_zbr: '',
                xm_dljg: '',
                xm_pbhs: 1,
                xm_pbdd_id: '',
                xm_pb_time_day: new Date(),
                xm_pb_time_h: '14',
                xm_pb_time_d: '30',
                xm_pb_time: '1998-02-02 22:31:53',
                xm_pwqd_time_day: new Date(),
                xm_pwqd_time_h: '14',
                xm_pwqd_time_d: '30',
                xm_pwqd_time: '1989-01-22 22:07:25',
                day_1: '8',
                day_2: '7',
                xm_dq: '和田地区'
            }
            this.xuanzexiangmuPopYes = false
            this.activeName = '1'
            this.getCreateProjectList()
        },
        async zhaobiaorenPopOpen() {
            // 获取单位列表
            const res = await danweiList({
                page: 0,
                size: 1000
            })
            this.zhaobiaorenPopList = res.data.result
        },
        getCurrentRow2(row) {
            // 单位点击确定赋值
            if (this.zhaobiaorenIsOne == 1) {
                this.formLabelAlign.xm_zbr = row.name
            } else {
                this.formLabelAlign.xm_dljg = row.name
            }
        },
        handleCheckChange(res) {
            this.yixuanzhuanyeThis = [
                ...this.yixuanzhuanyeThis,
                { name: res.label, proid: this.formLabelAlign.id }
            ]
        },
        async addDiscipline() {
            // 添加专业前置判断
            if (!this.formLabelAlign.id) {
                await this.addProject(1, false)
            }
            if (this.formLabelAlign.id) {
                this.zhuanyexinxiPop = true
            }
        },
        async isAddDiscipline() {
            // 确认添加专业
            let newArray = [...this.yixuanzhuanye, ...this.yixuanzhuanyeThis]
            for (var i = 0; i < newArray.length - 1; i++) {
                for (var j = i + 1; j < newArray.length; j++) {
                    if (newArray[i].name == newArray[j].name) {
                        newArray.splice(j, 1)
                        j-- // 因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
                    }
                }
            }
            await zhuanyeAdd(newArray)
            this.getZhuanyeList()
        },
        sliectDeleteMajor(item) {
            this.yixuanzhuanyeDetail = item
        },
        async deleteMajor() {
            // 删除专业
            // this.yixuanzhuanye = this.yixuanzhuanyeDetail
            await zhuanyeDelete(this.yixuanzhuanyeDetail)
            this.getZhuanyeList()
        },
        async getZhuanyeList() {
            // 获取专业列表
            if (!this.formLabelAlign.id) return
            const res = await zhuanyeGetlist({ proid: this.formLabelAlign.id })
            this.yixuanzhuanye = res.data.result
        },
        // 评委 ========================
        async pingweiPopOpen() {
            // 获取评委列表
            if (!this.formLabelAlign.id) return
            const res = await zhaobiaorenpingweiGetlist({ proid: this.formLabelAlign.id })
            this.pingweiList = res.data.result
        },
        async addPingweiReqProvide() {
            // 新增评委 前置
            if (!this.formLabelAlign.id) {
                await this.addProject(1, false)
            }
            if (this.formLabelAlign.id) {
                this.addPingwei = true
            }
        },
        async addPingweiReq() {
            // 新增评委
            const res = await zhaobiaorenpingweiAdd({
                proid: this.formLabelAlign.id,
                ...this.addPingweiFrom
            })
            this.pingweiPopOpen()
        },
        sliectDaibiao(item) {
            this.xuanZhongpingwei = item
        },
        async postZhaobiaorenpingweiDeleteList() {
            // 清除专业
            const res = await zhaobiaorenpingweiDeleteList(this.xuanZhongpingwei)
            this.pingweiPopOpen()
        },
        // 分页处理=======================
        handleSizeChange(item) {
            this.tableDataSize = item
            this.getCreateProjectList()
        },
        handleCurrentChange(item) {
            this.tableDataPage = item - 1
            this.getCreateProjectList()
        },
        pickerOptions() {
            console.log('时间选择')
        }
    }
}
</script>
<style lang="scss">
.management {
    height: calc(100vh - 60px);
    .el-radio {
        margin-right: 10px;
    }
    .el-table__header-wrapper {
        background-color: #fafafa !important;
    }
    .input-clone {
        transition: 0.3s !important;
        &:hover {
            color: #2590eb !important;
        }
    }
    .add-object {
        display: flex;
        align-items: center;
        justify-content: center;
        .el-dialog {
            width: 95%;
            height: 95%;
            margin: 0 !important;
            border-radius: 4px;
            .el-dialog__title {
                font-size: 16px;
            }
            .el-dialog__header {
                border-bottom: 1px solid #f0f2f5;
            }
            .el-dialog__body {
                height: calc(100% - 55px);
                padding: 0;
                overflow: hidden;
            }
            .el-tabs__nav {
                border: none;
            }
            .el-tabs {
                .el-tabs__header {
                    margin: 0;
                    .is-active {
                        background: #fff;
                        border: 1px solid #ebebeb;
                        &::before {
                            content: ' ';
                            width: 100%;
                            position: absolute;
                            height: 2px;
                            background: #fff;
                            left: 0;
                            bottom: -2px;
                        }
                    }
                }
                .el-tabs__item {
                    margin-right: 14px;
                    padding: 0 10px;
                    border-left: none;
                    border: none;
                    padding: 0 20px;
                    position: relative;
                    border-radius: 4px 4px 0 0;
                    background: #f5f5f5;
                    border-bottom: 1px solid #ebebeb;
                }
                .el-form-item__label {
                    white-space: nowrap;
                }
                .el-collapse-item__header {
                    border-bottom: 1px solid rgb(37, 144, 235);
                }

                .el-collapse-item__wrap {
                    border: none;
                }
            }

            .el-collapse {
                border: none;
            }
            .input-left-icon {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 35px;
                font-size: 12px;
                color: #5c5c5c;
                cursor: pointer;
            }
            .input-left-icon2 {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 12px;
                font-size: 12px;
                color: #5c5c5c;
                cursor: pointer;
            }
        }
    }
}
.el-collapse-item__header {
    border-bottom: 1px solid rgb(37, 144, 235) !important;
}
.el-collapse-item__wrap {
    border: none !important;
}
.el-tooltip__popper {
    width: 630px;
}
.tipsPop {
    .el-dialog__body {
        padding-top: 0px !important;
    }
}
.xuanzexiangmuPop {
    display: flex;
    align-items: center;
    justify-content: center;
    .el-dialog {
        width: 95%;
        height: 95%;
        margin: 0 !important;
        border-radius: 4px;
        .el-dialog__header {
            border-bottom: 1px solid #f0f2f5;
        }
        .el-dialog__body {
            padding: 0;
            height: 85%;
        }
        .el-radio .el-radio__label {
            display: none;
        }
        .el-pager {
            .number {
                border: 1px solid #d6d6d6;
                background: transparent;
            }
            .number.active {
                background: transparent !important;
                border-color: #2590eb !important;
                color: #2590eb !important;
            }
        }
    }
}
.xuanzedanwei {
    .el-dialog {
        width: 1000px;
        height: 640px;
    }
}
.el-form-item {
    margin-bottom: 8px;
}
.el-form-item[must] {
    .el-form-item__label {
        position: relative;
        &::before {
            content: '*';
            position: absolute;
            top: 55%;
            transform: translateY(-50%);
            right: 2px;
            color: red;
            font-size: 18px;
        }
    }
}
.extract-object {
    display: flex;
    align-items: center;
    justify-content: center;
    .el-dialog {
        width: 85%;
        height: 625px;
        margin: 0 !important;
        border-radius: 4px;
        .el-dialog__header {
            padding: 14px 20px;
            border-bottom: 1px solid #f0f2f5;
        }
        .el-dialog__body {
            padding: 0;
            height: calc(100% - 54px);
        }
        .el-collapse {
            border: none;
            .el-collapse-item__arrow {
                color: rgb(37, 144, 235);
            }
        }
        .el-collapse-item__header {
            border: none;
            border-bottom: 1px solid rgb(37, 144, 235);
        }
        .el-collapse-item__wrap {
            border: none;
        }
        .flow-info {
            display: flex;
            flex-direction: column;
            align-items: center;

            .finish {
                width: 138px;
                height: 36px;
                border-radius: 18px;
                background-color: #9ba3b9;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                position: relative;
                padding-left: 20px;
                box-sizing: border-box;
                margin-top: 36px;
                .finish-item {
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    display: block;
                    width: 28px;
                    height: 28px;
                    background-color: #fff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .arrow-bottom {
                    display: none;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    bottom: -26px;
                    height: 19px;
                }
            }
            .finish.is-active {
                background-color: #4484ed;
                .arrow-bottom {
                    display: block;
                }
            }
            .finish.is-active-tz {
                background-color: #f88e3c;
                &::after {
                    content: ' ';
                    width: 141px;
                    height: 39px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    border: 1px solid #f88e3c;
                    border-radius: 20px;
                }
                .arrow-bottom {
                    display: block;
                }
            }
        }
    }
}
.el-table__cell .cell {
    color: #5c5c5c !important;
}
</style>
