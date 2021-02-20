const { Good, Auction, User, sequelize } = require('./models');
const schedule = require('node-schedule');

module.exports = async () => {
    console.log('checkAuction');
    try {
        const targets = await Good.findAll({
            where: { soldId: null },
        });
        targets.forEach(async (target) => {
            const end = new Date(target.createdAt);
            end.setHours(end.getHours() + target.end);
            if (new Date() > end) { // 경매가 종료된 애들 중에 낙찰이 안된 것
                const success = await Auction.findOne({
                    where: {goodId: target.id},
                    order: [['bid', 'DESC']],
                });

                if (success) {
                    await Good.update({soldId: success.userId}, {where: {id: target.id}});
                    await User.update({
                        money: sequelize.literal(`money - ${success.bid}`),
                    }, {
                        where: {id: success.userId},
                    });
                } else {
                    await Good.update({ soldId: target.ownerId }, { where: { id: target.id }});
                }
            } else {    // 아직 경매가 진행중인 것들
                schedule.scheduleJob(end, async () => {
                    const success = await Auction.findOne({
                        where: { goodId: target.id },
                        order: [['bid', 'DESC']],
                    });

                    if (success) {
                        await Good.update({soldId: success.userId}, {where: {id: target.id}});
                        await User.update({
                            money: sequelize.literal(`money - ${success.bid}`),
                        }, {
                            where: {id: success.userId},
                        });
                    } else {
                        await Good.update({ soldId: target.ownerId }, { where: { id: target.id }});
                    }
                })
            }
        });
    } catch (error) {
        console.error(error);
    }
};
