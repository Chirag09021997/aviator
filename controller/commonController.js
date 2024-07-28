const { methods: commonService } = require('../services/index');
const renderPage = (req, res, view, options) => {
    res.render(view, {
        title: options.title,
        activePage: options.activePage,
        auth: options.auth,
        errorMsg: options.errorMsg || "",
        errors: options.errors || [],
        formData: options.formData || [],
        detail: options.detail || null,
        oldVal: options.oldVal || null,
        ...options,
    });
};


const cmDeleteRecord = async (req, res, model) => {
    const id = req?.params?.id;
    if (!id) {
        return res.status(400).render("error", { error: "Bad Request" });
    }

    try {
        const dataCheck = await commonService.get(model, { where: { id } });

        if (!dataCheck) {
            return res.status(404).send({
                success: false,
                message: `Cannot find id=${id}.`,
            });
        }

        const deleteData = await commonService.delete(model, { where: { id } });

        if (deleteData) {
            res.status(200).send({ success: true });
        } else {
            res.status(404).send({
                success: false,
                message: `Cannot Delete Data`,
            });
        }
    } catch (error) {
        console.error("cmDeleteRecord=>", error.message);
        res.status(500).render("error", { error: "Internal Server Error" });
    }
};

const createSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')          // Replace spaces with -
        .replace(/[^\w\-]+/g, '')      // Remove all non-word characters
        .replace(/\-\-+/g, '-')        // Replace multiple - with single -
        .replace(/^-+/, '')            // Trim - from start of text
        .replace(/-+$/, '');           // Trim - from end of text
};

module.exports = { renderPage, cmDeleteRecord, createSlug };