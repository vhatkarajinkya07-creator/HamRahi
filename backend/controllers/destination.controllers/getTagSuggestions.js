const { getSuggestionsByTag } = require("../../services/discover.service");

const getTagSuggestions = async (req, res) => {

    try {

        const { tag } = req.params;

        if (!tag) {
            return res.status(400).json({
                message: "Tag is required"
            });
        }

        const limit = parseInt(req.query.limit) || 40;

        const suggestions = await getSuggestionsByTag(tag, limit);

        return res.status(200).json({
            tag,
            count: suggestions.length,
            suggestions
        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({
            message: err.message
        });

    }

};

module.exports = getTagSuggestions;