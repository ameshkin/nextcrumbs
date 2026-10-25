"use client";

import * as React from "react";
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link as MUILink,
  Typography,
  Box,
  type BreadcrumbsProps as MUIBreadcrumbsProps,
  type SxProps,
  type Theme,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";
import { BreadcrumbJsonLd, breadcrumbsToJsonLd } from "./utils/jsonld";

/**
 * Individual breadcrumb item configuration.
 */
export type BreadcrumbItem = {
  /** Display label for the breadcrumb */
  label: string;
  /** Optional href for the breadcrumb link (omit for current page) */
  href?: string;
  /** Optional icon to display before the label */
  icon?: React.ReactNode;
  /** Optional title/tooltip text for the breadcrumb */
  title?: string;
  /** If true, adds `target="_blank"` and `rel="noopener noreferrer"` for external links */
  external?: boolean;
};

export type BreadcrumbLinkProp = "href" | "to";
export type BreadcrumbSize = "small" | "medium" | "large";

/**
 * Props for the Breadcrumbs component.
 */
export type BreadcrumbsProps = {
  /** Array of breadcrumb items to display */
  items: BreadcrumbItem[];
  /** Custom link component (e.g., Next.js `Link` or React Router `Link`) */
  LinkComponent?: React.ElementType;
  /**
   * Which routing prop to pass to `LinkComponent`.
   * Use `"href"` for Next.js / MUI (default). Use `"to"` for React Router `Link`.
   * When `"to"`, a native `href` is still set so right-click / middle-click /
   * "Open in new tab" / "Copy link" keep working.
   */
  linkProp?: BreadcrumbLinkProp;
  /** Props to pass through to the underlying MUI Breadcrumbs component */
  muiProps?: Omit<
    MUIBreadcrumbsProps,
    "children" | "maxItems" | "itemsBeforeCollapse" | "itemsAfterCollapse" | "expandText"
  >;
  /** Custom separator icon/node between breadcrumb items */
  separatorIcon?: React.ReactNode;
  /**
   * Label used when the home crumb (`homeHref`) is rendered.
   * Does not trigger the home icon by itself (icon is href-based).
   */
  homeLabel?: string;
  /** Href that receives the automatic Home icon (default: "/") */
  homeHref?: string;
  /** ARIA label for the breadcrumb navigation (default: "Breadcrumb") */
  ariaLabel?: string;
  /** If true, reduces spacing between items for a more compact display */
  dense?: boolean;
  /** Visual size of crumb text (default: "medium") */
  size?: BreadcrumbSize;
  /**
   * Truncate long labels with an ellipsis.
   * `true` uses a 160px max width. A number sets max width in px.
   */
  truncate?: boolean | number;
  /** Collapse long trails (passed to MUI Breadcrumbs) */
  maxItems?: number;
  /** Items kept before the collapse ellipsis (MUI) */
  itemsBeforeCollapse?: number;
  /** Items kept after the collapse ellipsis (MUI) */
  itemsAfterCollapse?: number;
  /** Tooltip / aria text for the collapse button (MUI) */
  expandText?: string;
  /**
   * When set, also emits a BreadcrumbList JSON-LD script for these items.
   * Relative hrefs resolve against this origin.
   */
  jsonLdOrigin?: string;

  /** Custom styles for the root breadcrumbs container */
  sx?: SxProps<Theme>;
  /** Custom styles applied to all breadcrumb items */
  itemSx?: SxProps<Theme>;
  /** Custom styles applied to breadcrumb links */
  linkSx?: SxProps<Theme>;
  /** Custom styles applied to the current (last) breadcrumb item */
  currentSx?: SxProps<Theme>;
  /** Custom styles for the content wrapper (icon + label) */
  contentSx?: SxProps<Theme>;
  /** Custom styles for breadcrumb icons */
  iconSx?: SxProps<Theme>;
  /** Custom styles for breadcrumb labels */
  labelSx?: SxProps<Theme>;
};

const sxJoin = (...parts: Array<SxProps<Theme> | undefined>): SxProps<Theme> =>
  parts.filter(Boolean) as SxProps<Theme>;

const SIZE_FONT: Record<BreadcrumbSize, number> = {
  small: 12,
  medium: 14,
  large: 16,
};

/**
 * Builds props for the consumer Link.
 * Always includes a string `href` so the rendered `<a>` stays a real hyperlink
 * (context menu, open in new tab, middle-click, copy link address).
 * When `linkProp` is `"to"`, also sets `to` for React Router.
 */
export function getLinkRoutingProps(
  href: string,
  linkProp: BreadcrumbLinkProp = "href"
): { href: string; to?: string } {
  if (linkProp === "to") {
    return { to: href, href };
  }
  return { href };
}

type CrumbContentProps = {
  icon?: React.ReactNode;
  label: string;
  title?: string;
  contentSx?: SxProps<Theme>;
  iconSx?: SxProps<Theme>;
  labelSx?: SxProps<Theme>;
  truncateSx?: SxProps<Theme>;
};

function CrumbContent({
  icon,
  label,
  title,
  contentSx,
  iconSx,
  labelSx,
  truncateSx,
}: CrumbContentProps) {
  return (
    <Box
      component="span"
      sx={sxJoin(
        {
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          minWidth: 0,
        },
        contentSx
      )}
      title={title || label}
    >
      {icon && (
        <Box component="span" sx={iconSx}>
          {icon}
        </Box>
      )}
      <Typography component="span" sx={sxJoin(truncateSx, labelSx)}>
        {label}
      </Typography>
    </Box>
  );
}

/**
 * Breadcrumbs component built on MUI with Next.js and React Router support.
 *
 * @example
 * ```tsx
 * import Link from "next/link";
 * import { Breadcrumbs } from "@ameshkin/nextcrumbs";
 *
 * <Breadcrumbs
 *   LinkComponent={Link}
 *   items={[
 *     { label: "Home", href: "/" },
 *     { label: "Products", href: "/products" },
 *     { label: "New Product" }
 *   ]}
 * />
 * ```
 *
 * React Router:
 * ```tsx
 * <Breadcrumbs LinkComponent={RouterLink} linkProp="to" items={items} />
 * ```
 */
export default function Breadcrumbs({
  items,
  LinkComponent = MUILink,
  linkProp = "href",
  muiProps,
  separatorIcon = <ChevronRightIcon fontSize="small" />,
  homeLabel = "Home",
  homeHref = "/",
  ariaLabel = "Breadcrumb",
  dense = false,
  size = "medium",
  truncate = false,
  maxItems,
  itemsBeforeCollapse,
  itemsAfterCollapse,
  expandText,
  jsonLdOrigin,
  sx,
  itemSx,
  linkSx,
  currentSx,
  contentSx,
  iconSx,
  labelSx,
}: BreadcrumbsProps) {
  const safeItems = Array.isArray(items) ? items : [];
  const lastIndex = safeItems.length - 1;
  const fontSize = SIZE_FONT[size] ?? SIZE_FONT.medium;

  const truncateSx: SxProps<Theme> | undefined = truncate
    ? {
        maxWidth: typeof truncate === "number" ? truncate : 160,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        display: "inline-block",
        verticalAlign: "bottom",
      }
    : undefined;

  const defaultRootSx: SxProps<Theme> = {
    mb: 0,
    "& .MuiBreadcrumbs-li": { display: "flex", alignItems: "center", minWidth: 0 },
    "& .MuiTypography-root, a": { fontSize, lineHeight: 1.2 },
    ...(dense && { "& .MuiBreadcrumbs-ol": { gap: 0.5 } }),
  };

  const defaultLinkSx: SxProps<Theme> = {
    textDecoration: "none",
    color: "primary.main",
    "&:hover": { textDecoration: "underline" },
  };

  const defaultCurrentSx: SxProps<Theme> = { color: "text.secondary" };

  const renderCrumb = (item: BreadcrumbItem, index: number) => {
    const isLast = index === lastIndex;
    const isLink = !!item.href && !isLast;
    const labelStr = typeof item.label === "string" ? item.label : "";
    // Home icon is href-based only (not label match), so mid-trail "Home" pages stay clean.
    const isHome = item.href === homeHref;
    const icon =
      item.icon ?? (isHome ? <HomeIcon color="primary" sx={{ fontSize: Math.round(fontSize * 1.25) }} /> : null);
    const label = isHome ? homeLabel : labelStr;
    const key = `${index}-${item.href || labelStr || "item"}`;

    const content = (
      <CrumbContent
        icon={icon}
        label={label}
        title={item.title}
        contentSx={contentSx}
        iconSx={iconSx}
        labelSx={labelSx}
        truncateSx={truncateSx}
      />
    );

    if (isLink && typeof item.href === "string") {
      const routingProps = getLinkRoutingProps(item.href, linkProp);

      return (
        <MUILink
          key={key}
          component={LinkComponent}
          underline="hover"
          {...routingProps}
          sx={sxJoin(defaultLinkSx, linkSx, itemSx)}
          {...(item.external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
        >
          {content}
        </MUILink>
      );
    }

    return (
      <Typography
        key={key}
        component="span"
        aria-current={isLast ? "page" : undefined}
        sx={sxJoin(defaultCurrentSx, currentSx, itemSx)}
      >
        {content}
      </Typography>
    );
  };

  const trail = (
    <MUIBreadcrumbs
      aria-label={ariaLabel}
      separator={separatorIcon}
      sx={sxJoin(defaultRootSx, sx)}
      maxItems={maxItems}
      itemsBeforeCollapse={itemsBeforeCollapse}
      itemsAfterCollapse={itemsAfterCollapse}
      expandText={expandText}
      {...muiProps}
    >
      {safeItems.map(renderCrumb)}
    </MUIBreadcrumbs>
  );

  if (!jsonLdOrigin) return trail;

  return (
    <>
      <BreadcrumbJsonLd crumbs={breadcrumbsToJsonLd(safeItems)} origin={jsonLdOrigin} />
      {trail}
    </>
  );
}
