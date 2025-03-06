import React from 'react';
import { Button, Card, Typography, Table } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useModel } from 'umi';
import { choices } from '@/services/RockPaperScissors/index';

const { Title } = Typography;

const RockPaperScissors: React.FC = () => {
    const { history, playGame } = useModel('useGameModel');
    console.log('choices:', choices);

    const columns = [
        {
            title: 'Lần chơi',
            dataIndex: 'id',
            key: 'id',
            render: (text: number, record: any, index: number) => index + 1,
        },
        {
            title: 'Bạn chọn',
            dataIndex: 'player',
            key: 'player',
        },
        {
            title: 'Bot chọn',
            dataIndex: 'bot',
            key: 'bot',
        },
        {
            title: 'Kết quả',
            dataIndex: 'result',
            key: 'result',
        },
    ];

    return (
        <PageContainer>
            <Card>
                <Title level={2}>Lựa chọn:</Title>
                <div style={{ marginBottom: 16 }}>
                    {choices.map((choice) => (
                        <Button key={choice} onClick={() => playGame(choice as Choice)} style={{ marginRight: 8 }}>
                            {choice}
                        </Button>
                    ))}
                </div>

                <Title level={3}>Lịch sử kết quả</Title>
                <Table
                    bordered
                    dataSource={history.map((item, index) => ({ ...item, id: index }))}
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                    rowKey="id"
                />
            </Card>
        </PageContainer>
    );
};

export default RockPaperScissors;
