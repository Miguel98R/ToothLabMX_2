let datatable_aggregate = async function (req,model_, pipeline_ = [], search_fields, options = {
    allowDiskUse: true,
    search_by_field: false
}, fIn_, fOut_) {

    let pipeline2 = []
    let pipeline = [...pipeline_]

    try {

        let response = {
            message: 'OK',
            recordsFiltered: 0,
            recordsTotal: 0,
            total: 0,
            success: true,
            data: {}
        };

        let body = req.body

        /**  Execute and process body before create new element */
        if (fIn_ && typeof (fIn_) == 'function') {
            let res_ = await fIn_(req, pipeline)
            req = res_.req
            pipeline = res_.pipeline
        }

        let {where, whereObject, like} = req.body


        let order = {};
        let search_columns_or = []

        if (req.body.columns && req.body.order) {
            for (let item of req.body.order) {
                let name = req.body.columns[item.column].data;
                let search = (req.body.columns[item.column]?.search?.value) || '';
                let dir = item.dir;
                order[name] = dir.toUpperCase() == 'DESC' ? -1 : 1;

                if (search !== "" && options.search_by_field) {
                    let inner = {}
                    inner[name] = {$regex: search, $options: 'i'}
                    search_columns_or.push(inner)
                }
            }
        }

        if (options.search_by_field) {
            pipeline.push({
                $match: {$or: search_columns_or}
            })
        }


        let fields = []
        if (search_fields) {
            if (typeof search_fields == 'string' && search_fields != '') {
                fields = search_fields.split(',')
            }
            if (typeof search_fields == "object" && Array.isArray(search_fields)) {
                fields = search_fields
            }
        }

        if (fields.length > 0 && body?.search?.value != '') {
            let or = []
            for (let item of fields) {
                let inner = {}
                if (isNaN(Number(body?.search?.value))) {
                    inner[item] = {$regex: body?.search?.value, $options: 'i'}
                } else {
                    inner[item] = Number(body?.search?.value)
                }
                or.push(inner)
            }
            pipeline.push({
                $match: {$or: or}
            })
        }

        let find = {};
        if (like) {
            for (const [key, val] of Object.entries(like)) {
                find[key] = {$regex: String(val).trim(), $options: 'i'};
            }
        }
        if (where) {
            for (const [key, val] of Object.entries(where)) {
                find[key] = val;
            }
        }
        if (whereObject) {
            for (const [key, val] of Object.entries(whereObject)) {
                find[key] = ObjectId(val);
            }
        }

        pipeline.push({
            $match: find
        })


        let table = await model_.aggregate(pipeline).allowDiskUse(options.allowDiskUse)
        let total = table.length


        pipeline2 = [...pipeline]

        pipeline2.push({
            $sort: order
        })

        pipeline2.push({
            $skip: Number(body?.start || 0)
        })
        pipeline2.push({
            $limit: Number(body?.length || 0)
        })




        let table2 = await model_.aggregate(pipeline2).allowDiskUse(options.allowDiskUse)


        response.data = table2
        response.recordsTotal = total
        response.recordsFiltered = total
        response.total = total

        if (fOut_ && typeof (fOut_) == 'function') {
            response = await fOut_(response)
        }


        return response


    } catch (e) {
        let response = {}
        response.error = e
        response.success = false
        response.message = e
        response.code = options && options.customErrorCode ? options.customErrorCode : 500
        response.data = {}

        throw e
    }


}

module.exports = {datatable_aggregate}